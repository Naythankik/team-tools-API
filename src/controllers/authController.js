const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const userResource = require('../resources/userResource');
const { verifyOTPRequest, emailRequest, registerRequest} = require("../requests/authRequest");

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

            return successResponse(res, 'User verified successfully', { user: userResource(result.user) }, 201);
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

        try {
            const result = await AuthService.createUser(value);

            if (result.error) {
                return errorResponse(res, result.error, 400);
            }

            return successResponse(res, "User created successfully",  { user: userResource(result.user)}, 200);
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

}

module.exports = new AuthController();
