const {verifyJwtToken, generateJwtToken} = require("../utils/token");
const User = require('../models/userModel');
const {errorResponse} = require("../utils/responseHandler");

class UserService {
    refreshToken = async (res, token) => {
        const decoded = verifyJwtToken(token);

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return errorResponse(res, 'Invalid or inactive user', 401);
        }

        const newAccessToken = generateJwtToken(user, '15m');
        const newRefreshToken = generateJwtToken(user, '30d');

        // Set a new refresh token
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return  {
            access_token: newAccessToken,
        };
    }
}

module.exports = new UserService()
