const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/initialPhase', authController.registerWithEmail);
router.post('/register/finalPhase/:token', authController.completeRegister);
router.post('/register/verify-otp', authController.verifyOTP);
router.post('/register/request-otp', authController.requestOTP);
// router.post('/login', authController.login);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);
// router.post('/verify-email', authController.verifyEmail);
//
// Refresh token (optional if using JWT + refresh token pattern)
// router.post('/refresh-token', authController.refreshToken);

// Protected routes
// router.post('/logout', authenticate, authController.logout);
// router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
