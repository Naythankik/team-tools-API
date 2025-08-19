const express = require('express');
const router = express.Router();
const multerUpload = require('../config/multer');

const userController = require('../controllers/userController');

router.post('/logout', userController.logout);
router.get('/me', userController.getCurrentUser);
router.put('/update-profile', userController.updateProfile)
router.put('/update-password', userController.updatePassword)
router.put('/update-avatar', multerUpload.single('avatar'), userController.updateAvatar)

router.get('/workspaces', userController.workspace)
module.exports = router;
