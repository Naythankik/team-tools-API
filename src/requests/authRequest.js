const Joi = require("joi");

const emailRequest = (data) => {
    return Joi.object({
        email: Joi.string().email().required(),
    }).validate(data, { abortEarly: false });
}

const verifyOTPRequest = (data) => {
    return Joi.object({
        code: Joi.number().required(),
        email: Joi.string().email().required()
    }).validate(data, { abortEarly: false });
}

const registerRequest = (data) => {
    return Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required()
    }).validate(data, { abortEarly: false });
}

const loginRequest = (data) => {
    return Joi.object({
        identifier: Joi.string().required(),
        password: Joi.string().required()
    }).validate(data, { abortEarly: false });
}

const resetPasswordRequest = (data) => {
    return Joi.object({
        identifier: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string().required(),
        token: Joi.string().required()
    }).validate(data, { abortEarly: false });
}

module.exports = {
    emailRequest,
    loginRequest,
    registerRequest,
    verifyOTPRequest,
    resetPasswordRequest
}
