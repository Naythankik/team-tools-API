const {errorResponse, successResponse} = require("../utils/responseHandler");
const userService = require("../services/userService");
const User = require('../models/User');
const UserResource = require("../resources/userResource");
const {updateProfileRequest, updatePasswordRequest} = require("../requests/userRequest");

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

    updateProfile = async (req, res) => {
        const { value, error } = updateProfileRequest(req.body || {});
        const { id } = req.user

        if (error) {
            return errorResponse(res, '', 400, error.details.map(err => err.message));
        }
        if(Object.keys(value).length === 0){
            return errorResponse(res, 'No data provided', 400);
        }

        try {
            const result = await userService.updateProfile(id, value);

            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            return successResponse(
                res,
                result.message,
                200
            );
        } catch (e) {
            console.log(e)
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    updatePassword = async (req, res) => {
        const { value, error } = updatePasswordRequest(req.body || {});
        const { id } = req.user

        if (error) {
            return errorResponse(res, '', 400, error.details.map(err => err.message));
        }

        if(value.newPassword !== value.confirmPassword){
            return errorResponse(res, 'Passwords do not match', 400);
        }

        try {
            const result = await userService.updatePassword(id, value);

            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            return successResponse(
                res,
                result.message,
                200
            );
        } catch (e) {
            console.log(e)
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    updateAvatar = async (req, res) => {
        const { id } = req.user
        const file = req.file;

        if(!file){
            return errorResponse(res, 'Image is not specified', 400);
        }

        try {
            const result = await userService.updateAvatar(id, file);

            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            return successResponse(
                res,
                result.message,
                200
            );
        } catch (e) {
            console.log(e)
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    dashboard = async (req, res) => {
        const { id } = req.user

        try {
            const result = await userService.dashboard(id);

            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            return successResponse(
                res,
                result.message,
                result.data,
                200
            );
        } catch (e) {
            console.log(e)
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }
}

module.exports = new UserController();
