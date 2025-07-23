const Token = require('../models/tokenModel');
const User = require('../models/userModel');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate unique code
 *
 * @returns {Promise<*|string>}
 */
const generateCode = async () => {
    const code = Math.floor(Math.random() * 999999).toString().padStart(6, '0')

    const verifyCode = await Token.findOne({otp: code})

    if(verifyCode) {
        return generateCode()
    }

    return code;
}

/**
 * Generate random token with dynamic length
 *
 * @param len
 * @returns {Promise<*|string>}
 */
const generateToken = async (len = 32) => {
    const token = crypto.randomBytes(len).toString('hex');

    const checkIfTokenExists = await User.findOne({ registrationToken: token }).lean()

    if(checkIfTokenExists){
        return generateToken()
    }

    return token;
}

/**
 * Generate JWT with a dynamic expiration date
 *
 * @param user
 * @param expiresIn
 * @returns {string}
 */
const generateJwtToken = (user, expiresIn) => {
    return JWT.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn }
    );
}

/**
 * Verify token given
 *
 * @param token
 */
const verifyJwtToken = (token) => {
    return JWT.verify(token, process.env.JWT_SECRET);
};


module.exports = {
    generateCode,
    generateToken,
    generateJwtToken,
    verifyJwtToken
};
