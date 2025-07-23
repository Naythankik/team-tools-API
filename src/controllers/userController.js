const {errorResponse, successResponse} = require("../utils/responseHandler");
const userService = require("../services/userService");
const User = require('../models/userModel');
const UserResource = require("../resources/userResource");

class UserController{
    refreshToken = async (req, res) => {
        let token = req?.cookies?.refreshToken ?? req.headers?.cookie;

        if(token.includes('refreshToken')){
            token = token.split('=')[1]
        }

        if (!token) {
            return errorResponse(res, 'Refresh token not found', 401);
        }

        try {
            const response = await userService.refreshToken(res, token)

            return successResponse(res, 'Refresh token successful', response, 200);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return errorResponse(res, 'Refresh token expired', 401);
            }
            return errorResponse(res, 'Invalid refresh token', 401);
        }

    }

    logout = async (req, res) => {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });

        return successResponse(res,  'Logged out successfully');
    }

    getCurrentUser = async (req, res) => {
        try{
            const user = await User.findById(req.user.id);

            return successResponse(res, 'User found', { user: UserResource(user) });
        }catch (error){
            return errorResponse(res, 'User not found', 404);
        }
    }
}

module.exports = new UserController();
