const Joi = require("joi");

const updateProfileRequest = (data) => {
    return Joi.object({
        fullName: Joi.string().allow('').optional(),
        username: Joi.string().allow('').optional(),
        title: Joi.string().allow('').optional()
    }).validate(data, { abortEarly: false });
}

const updatePasswordRequest = (data) => {
    return Joi.object({
        oldPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required()
    }).validate(data, { abortEarly: false });
}

module.exports = {
    updateProfileRequest,
    updatePasswordRequest
}
