const {errorResponse, successResponse} = require("../utils/responseHandler");
const userService = require("../services/userService");
const User = require('../models/userModel');
const UserResource = require("../resources/userResource");

class UserController{
    logout = async (req, res) => {
        const response = await userService.logout(req, res);
        return successResponse(res,  response.message, {}, 200);
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
