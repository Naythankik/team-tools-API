const Joi = require('joi');
const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const userResource = require('../resources/userResource');

class AuthController {
    /**
     * Registers a new user with email.
     *
     * @param {Object} req - Express Request object
     * @param {Object} res - Express Response object
     * @returns {Promise<Object>} JSON response indicating success or failure
     *
     * @description
     * - Validates the email field using Joi
     * - Calls AuthService to create a user
     * - Returns error if user already exists
     * - Returns success with user info and token if created
     */
    registerWithEmail = async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const { error, value } = schema.validate(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const result = await AuthService.createUser(value);

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
        const { error, value } = Joi.object({
            otp: Joi.number().required(),
            email: Joi.string().email().required(),
        }).validate(req.body || {}, {abortEarly: false});

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

    completeRegister = async (req, res) => {

    }

}

module.exports = new AuthController();
