/**
 * Sends a standardized success response.
 *
 * @param {Object} res - Express Response object
 * @param {string} message - Success message
 * @param {Object} [data={}] - Optional data to return in the response
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {Object} JSON response with success = true
 *
 */
const successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

/**
 * Sends a standardized error response.
 *
 * @param {Object} res - Express Response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {Object} [errors={}] - Optional detailed error object
 * @returns {Object} JSON response with success = false
 *
 * @example
 * errorResponse(res, 'Validation failed', 400, { email: 'Email is required' });
 */
const errorResponse = (res, message, statusCode = 500, errors = {}) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};

module.exports = {
    successResponse,
    errorResponse,
};
