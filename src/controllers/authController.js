const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const userResource = require('../resources/userResource');
const { verifyOTPRequest, emailRequest, registerRequest, loginRequest, resetPasswordRequest} = require("../requests/authRequest");

class AuthController {

    registerWithEmail = async (req, res) => {
        const { error, value } = emailRequest(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const result = await AuthService.createUserEmail(value);

            // Handle service-level errors
            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            // Handle cases where a token already exists and hasn't expired
            if (result.message && !result.user) {
                return successResponse(res, result.message, {}, 200);
            }

            // Handle a newly created or re-tokened user
            return successResponse(
                res,
                result.message || 'User created successfully',
                {
                    user: userResource(result.user)
                },
                201
            );
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    };

    verifyOTP = async (req, res) => {
        const { error, value } = verifyOTPRequest(req.body || {});

        if (error) {
            return errorResponse(res, 'Validation Errors', 400, error.details.map(err => err.message));
        }

        try {
            const result = await AuthService.verifyOTP(value);

            if (result.error) {
                return errorResponse(res, result.error, 400);
            }

            return successResponse(
                res,
                'User verified successfully with the token for final Sign up',
                { user: userResource(result.user), token: result.registrationToken },
                201
            );
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    requestOTP = async (req, res) => {
        const { error, value } = emailRequest(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const result = await AuthService.createNewOTP(value);

            if (result.error) {
                return errorResponse(res, result.error, 400);
            }

            return successResponse(res, result.message,  {}, 200);
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    completeRegister = async (req, res) => {
        const { error, value } = registerRequest(req.body || {});

        if (error) {
            return errorResponse(res, 'Validation Errors', 400, error.details.map(err => err.message));
        }
        const { token } = req.params;
        try {
            const result = await AuthService.createUser(value, token);

            if (result.error) {
                return errorResponse(res, result.error, 400);
            }

            return successResponse(res, "User created successfully",  { user: userResource(result.user)}, 200);
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    login = async (req, res) => {
        const { error, value } = loginRequest(req.body || {});

        if (error) {
           return errorResponse(res, 'Validation Errors', 400, error.details.map(err => err.message));
        }

        try {
            const response = await AuthService.loginUser(res, value);

            return successResponse(res, 'Login successful', response, 200);
        }catch (error){
            return errorResponse(res, error.message, 401);
        }
    }

    forgotPassword = async (req, res) => {
        const { error, value} = emailRequest(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const response = await AuthService.forgotPassword(res, value);

            return successResponse(res, response.message);
        } catch (err) {
            return errorResponse(res, 'Failed to send reset email', 500);
        }
    }

    resetPassword = async (req, res) => {
        const { error, value} = resetPasswordRequest(req.body || {});

        if (error) {
            return errorResponse(res, 'Validation errors', 400, error.details.map(err => err.message));
        }

        try {
            const response = await AuthService.resetPassword(res, value);

            return successResponse(res, response.message);
        } catch (err) {
            return errorResponse(res, 'Failed to reset password', 500);
        }
    }

}

module.exports = new AuthController();
