const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    verifyEmail, 
    resendCode,
    forgetPassword, 
    resetPassword, 
    logout 
} = require('../controllers/authController');


router.post('/register', register);


router.post('/login', login);


router.post('/send-code', resendCode);


router.post('/verify-code', verifyEmail);


router.post('/forget-password', forgetPassword);


router.post('/reset-password/:token', resetPassword);


router.post('/logout', logout);

module.exports = router;
