const User = require('../models/userModel');
const {errorResponse} = require("../utils/responseHandler");

class UserService {
    logout = async (req, res) => {
        const { id } = req.user

        try{
            const user = await User.findById(id)

            if(!user){
                return errorResponse(res, 'User not found', 404)
            }

            user.whenLastActive = new Date();
            user.isActive = false
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
}

module.exports = new UserService()
