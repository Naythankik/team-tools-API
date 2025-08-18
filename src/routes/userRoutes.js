const express = require('express');
const router = express.Router();
const multerUpload = require('../config/multer');

const userController = require('../controllers/userController');

router.post('/logout', userController.logout);
router.get('/me', userController.getCurrentUser);
router.put('/update-profile', userController.updateProfile)
router.put('/update-password', userController.updatePassword)
router.put('/update-avatar', multerUpload.single('avatar'), userController.updateAvatar)

router.get('/dashboard', userController.dashboard)
//
// router.all('*', (req, res) => {
//     res.status(404).json({ message: 'Route not found in user API' });
// });

module.exports = router;
