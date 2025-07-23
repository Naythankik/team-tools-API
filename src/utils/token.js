const Token = require('../models/tokenModel');

const generateCode = async () => {
    const code = Math.floor(Math.random() * 999999).toString().padStart(6, '0')

    // check if the code exists in the database
    const verifyCode = await Token.findOne({otp: code})

    if(verifyCode) {
        return generateCode()
    }

    return code;
}


module.exports = {
    generateCode
};
