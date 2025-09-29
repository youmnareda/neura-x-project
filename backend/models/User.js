const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
    }, // For email verification

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      enum:["male" , "female"]
    },
    birthDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
