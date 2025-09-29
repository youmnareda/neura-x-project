const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getProfile,
    changeEmail,
    changePassword,
    deleteAccount,
    changeName
} = require('../controllers/profileController');


router.get('/me', protect, getProfile);


router.put('/change-email', protect, changeEmail);

router.put('/change-password', protect, changePassword);


router.put('/change-name', protect , changeName);


router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
