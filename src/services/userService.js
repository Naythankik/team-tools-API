const User = require('../models/userModel');
const {errorResponse} = require("../utils/responseHandler");
const {uploadImage} = require("../utils/uploadImage");

class UserService {
    logout = async (req, res) => {
        const { id } = req.user

        try{
            const user = await User.findById(id)

            if(!user){
                return errorResponse(res, 'User not found', 404)
            }

            user.whenLastActive = new Date();
            user.status = 'offline';
            await user.save();

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            });

            return { message: 'Logged out successfully' }
        }catch (err) {
            console.log(err.message)
            return errorResponse(res, 'Something went wrong', 500);
        }
    }

    updateProfile = async (userId, data) => {
        try{
            const user = await User.findById(userId)

            if(!user){
                return { error: 'User not found' }
            }

            if (data.fullName) {
                const parts = data.fullName.trim().split(/\s+/);
                data.firstName = parts[0];
                data.lastName = parts.slice(1).join(' ') || '';
                delete data.fullName;
            }

            await user.updateOne(data);
            return { message: 'User updated successfully' }

        }catch (err){
            return { error: 'Internal server error' };
        }
    }

    updatePassword = async (userId, data) => {
        try {
            const { oldPassword, newPassword } = data;

            const user = await User.findById(userId).select('+password');
            if (!user) {
                return { error: 'User not found' };
            }

            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) {
                return { error: 'Invalid old password' };
            }

            user.password = newPassword;
            await user.save();

            return { message: 'Password updated successfully' };
        } catch (err) {
            console.error(err);
            return { error: 'Internal server error' };
        }
    };

    updateAvatar = async (userId, file) => {
        try {
            const user = await User.findById(userId)
            if (!user) {
                return { error: 'User not found' };
            }

            user.avatar = await uploadImage(file.path, `${user.firstName}_${user.lastName}`, 'users/avatars');
            await user.save();

            return { message: 'Avatar updated successfully' };

        } catch (err) {
            console.error(err);
            return { error: 'Internal server error' };
        }
    }
}

module.exports = new UserService()
