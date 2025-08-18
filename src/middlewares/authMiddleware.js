const User = require('../models/User')
const {errorResponse} = require("../utils/responseHandler");
const { verifyJwtToken } = require("../utils/token");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'Access token missing or invalid', 401)
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (!token) {
            return errorResponse(res, 'Access token is malformed or missing', 401);
        }

        const decoded = verifyJwtToken(token);

        const user = await User.findById(decoded.id);

        if (!user || user.status === 'offline') {
            return errorResponse(res, 'User no longer exists or inactive', 401)
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return errorResponse(res, 'Token expired', 401)
        } else {
            return errorResponse(res, 'Authentication failed', 401)
        }
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Forbidden: Insufficient privileges', 403);
        }
        next();
    };
};


module.exports = {
    authenticate,
    authorizeRoles
};
