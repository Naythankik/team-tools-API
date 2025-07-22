const User = require('../models/userModel');

class AuthService {
    createUser = async (validatedData) => {
        const { email } = validatedData;

        try{
            const existingUser = await User.findOne({email})

            if(existingUser) return null;

            return await User.create({email});
        }catch (e) {
            console.log(e)
        }
    }
}

module.exports = new AuthService();
