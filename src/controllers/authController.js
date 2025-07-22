const Joi = require('joi');
const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const userResource = require('../resources/userResource');

class AuthController {
    registerWithEmail = async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const { error, value } = schema.validate(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const user = await AuthService.createUser(value);

            if (!user) {
                return errorResponse(res, "User already exists", 409);
            }

            return successResponse(res, 'User created successfully', { user: userResource(user) }, 201);
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

    completeRegister = async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const { error, value } = schema.validate(req.body || {});

        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        try {
            const user = await AuthService.createUser(value);

            if (!user) {
                return errorResponse(res, "User already exists", 409);
            }

            return successResponse(res, 'User created successfully', { user: userResource(user) }, 201);
        } catch (e) {
            return errorResponse(res, "Internal Server Error", 500, e.message);
        }
    }

}

module.exports = new AuthController();
