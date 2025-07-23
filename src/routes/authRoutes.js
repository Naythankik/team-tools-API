const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/initialPhase', authController.registerWithEmail);
router.post('/register/finalPhase/:token', authController.completeRegister);
router.post('/register/verify-email', authController.verifyOTP);
router.post('/register/request-otp', authController.requestOTP);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


module.exports = router;
