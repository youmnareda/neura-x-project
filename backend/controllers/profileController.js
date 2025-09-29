const User = require('../models/User');
const bcrypt = require('bcryptjs');


// Get User Profile
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password -verificationCode -resetPasswordToken -resetPasswordExpire');

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
};

// Update User Profile (firstName, lastName)
exports.changeName = async (req, res) => {
    const { firstName, lastName } = req.body;

    if (!firstName && !lastName) {
        return res.status(400).json({ message: 'At least one of firstName or lastName must be provided.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Change Email
exports.changeEmail = async (req, res) => {
    const { newEmail } = req.body;

    if (!newEmail) {
        return res.status(400).json({ message: 'New email is required.' });
    }

    try {
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const user = await User.findById(req.user.id);
        user.email = newEmail;
        user.isVerified = false; // Require re-verification if email changes
        await user.save();

        res.status(200).json({ message: 'Email updated. Please verify your new email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Change Password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'New passwords do not match.' });
    }

    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect.' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
