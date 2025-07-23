const Token = require('../models/tokenModel');
const User = require('../models/userModel');
const crypto = require('crypto');

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


module.exports = {
    generateCode,
    generateToken
};
