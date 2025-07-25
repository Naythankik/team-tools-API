const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/refresh-token', userController.refreshToken);
router.post('/logout', userController.logout);
router.get('/me', userController.getCurrentUser);

module.exports = router;
