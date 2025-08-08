const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const userResource = require('../resources/userResource');
const { verifyOTPRequest, emailRequest, registerRequest, loginRequest, resetPasswordRequest } = require("../requests/authRequest");

class AuthController {

    registerWithEmail = async (req, res) => {
        const { error, value } = emailRequest(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const result = await AuthService.createUserEmail(value);

            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            if (!result.user && result.message) {
                return successResponse(res, result.message, {}, 200);
            }

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
                result.message || 'User verified successfully',
                {
                    user: userResource(result.user),
                    token: result.registrationToken
                },
                201
            );

        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    requestOTP = async (req, res) => {
        const { error, value } = emailRequest(req.body || {});

        if (error) {
            return errorResponse(res, 'Validation Error', 400, error.details.map(err => err.message));
        }

        try {
            const result = await AuthService.requestNewOTP(value);

            if (result.error) {
                return errorResponse(res, result.error, 400);
            }

            return successResponse(
                res,
                result.message || 'OTP sent successfully',
                {},
                200
            );
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    };

    completeRegistration = async (req, res) => {
        const { error, value } = registerRequest(req.body || {});

        if (error) {
            return errorResponse(res, 'Validation Errors', 400, error.details.map(err => err.message));
        }

        const token =
            req.params.token ||
            req.query.token ||
            req.headers['x-registration-token'];

        if (!token) {
            return errorResponse(res, 'Registration token is required', 400);
        }

        try {
            const result = await AuthService.createUser(value, token);

            if (result.error) {
                return errorResponse(res, result.error, 400);
            }

            return successResponse(
                res,
                result.message || 'User created successfully',
                { user: userResource(result.user) },
                201
            );
        } catch (e) {
            return errorResponse(res, 'Internal Server Error', 500, e.message);
        }
    };

    login = async (req, res) => {
        const { error, value } = loginRequest(req.body || {});

        if (error) {
            return errorResponse(res, 'Validation Errors', 400, error.details.map(err => err.message));
        }

        try {
            const response = await AuthService.loginUser(value);

            // Set the cookie here
            res.cookie('refreshToken', response.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return successResponse(res, 'Login successful', {
                access_token: response.access_token,
                user: response.user
            }, 200);
        }catch (e) {
            console.error(error);
            return errorResponse(res, e.message || "Internal Server Error", 500);
        }
    }

    forgotPassword = async (req, res) => {
        const { error, value} = emailRequest(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const response = await AuthService.forgotPassword(value);

            if (response.error) {
                return errorResponse(res, response.error, 404);
            }

            return successResponse(res, response.message);
        } catch (err) {
            console.error(err);
            return errorResponse(res, 'Failed to send reset email', 500);
        }
    }

    resetPassword = async (req, res) => {
        const { error, value} = resetPasswordRequest(req.body || {});

        if (error) {
            return errorResponse(res, 'Validation errors', 400, error.details.map(err => err.message));
        }

        try {
            const result = await AuthService.resetPassword(value);
            if(result.error) {
                return errorResponse(res, result.error, 400);
            }

            return successResponse(res, result.message);
        } catch (err) {
            return errorResponse(res, 'Failed to reset password', 500);
        }
    }

    refreshToken = async (req, res) => {
        let token = req.cookies?.refreshToken;

        // Fallback if cookie-parser fails
        if (!token && req.headers?.cookie?.includes('refreshToken')) {
            const cookies = req.headers.cookie.split(';').map(cookie => cookie.trim());
            const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));
            token = refreshTokenCookie?.split('=')[1];
        }

        if (!token) {
            return errorResponse(res, 'Refresh token not found', 401);
        }

        try {
            const response = await AuthService.refreshToken(token);

            // Set a new refresh token cookie
            res.cookie('refreshToken', response.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return successResponse(res, 'Refresh token successful', {
                access_token: response.access_token
            }, 200);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return errorResponse(res, 'Refresh token expired', 401);
            }
            return errorResponse(res, 'Invalid refresh token', 401);
        }
    };
}

module.exports = new AuthController();
