const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/register/email', authController.registerWithEmail);
router.post('/register/complete', authController.completeRegister);
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
