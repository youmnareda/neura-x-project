const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const generateVerificationCode = require("../utils/generateVerificationCode");

// Register
exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    phoneNumber,
    password,
    confirmPassword,
  } = req.body;

  try {
    console.log("Starting registration process for:", email);

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode();
    console.log("Generated verification code:", verificationCode);

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      phoneNumber: phoneNumber.toString(),
      password: hashedPassword,
      verificationCode,
    });

    console.log(
      "User created successfully, attempting to send verification email"
    );
    const createToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // Send verification email
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify Your NeuraX Account",
        message: `
Hello ${user.firstName},

Thank you for registering with NeuraX!

Your verification code is: ${verificationCode}

Please use this code to verify your email address.

Best regards,
NeuraX Team
                `,
      });
      console.log("Verification email sent successfully to:", user.email);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
      // You might want to handle this differently based on your requirements
    }

    res.status(201).json({
      message: "Registered successfully! Verification code sent to your email.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        token:createToken
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error during registration",
      error: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend Verification Code
exports.resendCode = async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Invalid or missing email." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    const newCode = generateVerificationCode();
    user.verificationCode = newCode;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your New Verification Code",
      message: `New code: ${newCode}`,
    });

    res.status(200).json({ message: "Verification code resent." });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Email could not be sent: ${error.message}` });
  }
};

// Forgot Password
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `https://yourfrontend.com/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message: `Reset your password here: ${resetLink}`,
    });

    res.status(200).json({ message: "Reset link sent to email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully." });
};

