const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const { generateCode } = require("../utils/token");
const { createUserMail } = require("../utils/mail");

/**
 * Service class for authentication-related logic.
 */
class AuthService {

    /**
     * Creates a new user if the email does not already exist.
     *
     * @param {Object} validatedData - Validated data containing user details
     * @param {string} validatedData.email - Email address of the user
     * @returns {Promise<Object|string>} Returns an object with `user` if created, or an `error`/`message`
     */
    createUserEmail = async (validatedData) => {
        const { email } = validatedData;

        try {
            const existingUser = await User.findOne({ email }).populate('token', 'expiresAt');

            // If the user already exists
            if (existingUser) {
                const token = existingUser.token;

                const isTokenExpired = (token) => !token || token.expiresAt <= Date.now();
                if (isTokenExpired(token)) {
                    return {
                        message: 'Token has already been sent. Please check your email.',
                    };
                }

                // If token is expired, regenerate
                if (token && token.expiresAt <= Date.now()) {
                    await Token.deleteMany({user: existingUser._id});

                    const newOtp = await generateCode();
                    await Token.create({ otp: newOtp, user: existingUser._id });

                    return {
                        user: existingUser,
                        message: 'A new token has been generated.',
                    };
                }

                // User exists but has no token
                return { error: 'User already exists' };
            }

            // No user exists, create a new user
            const user = await User.create({ email });

            const otp = await generateCode();
            await Token.create({
                otp,
                user: user._id,
                expiresAt: Date.now() + 10 * 60 * 1000,
            });
            await createUserMail(user, otp);

            return { user };
        } catch (e) {
            console.error(e);
            return { error: 'Internal server error' };
        }
    };

    /**
     * Verifies the OTP associated with the user's email.
     *
     * @param {Object} validatedData - Validated data containing user details
     * @param {string} validatedData.email - Email address of the user
     * @param {string} validatedData.otp - OTP sent to the user's email
     * @returns {Promise<Object>} Returns an object with `user` if verified, or an `error` message
     */

    verifyOTP = async (validatedData) => {
        const { otp, email } = validatedData;

        try{
            // Find the user and populate the token
            const user = await User.findOne({ email }).populate('token');

            if (!user) {
                return { error: 'User not found' };
            }

            if(user.isEmailVerified) {
                return { error: 'User already verified' };
            }

            const token = user.token;

            // Check if the token exists and is valid
            if (!token || !token.otp) {
                return { error: 'OTP token not found or invalid' };
            }

            // Check OTP match
            if (token.otp !== otp) {
                return { error: 'OTP is incorrect. Try again.' };
            }

            // Check expiration
            if (token.expiresAt < Date.now()) {
                return { error: 'OTP has expired. Request for a new one.' };
            }

            user.isEmailVerified = true;
            await user.save();

            // Cleanup token
            await Token.deleteMany({ user: user._id });

            return { user };
        }catch (error){
            return { error: 'Internal server error' };
        }
    };

    /**
     * Sends a new OTP to the user's email address.
     *
     * @param {Object} validatedData - Validated data containing user details
     * @param {string} validatedData.email - Email address of the user
     * @returns {Promise<Object>} Returns a success message or an error object
     */

    createNewOTP = async (validatedData) => {
        const { email } = validatedData;

        try{
            const user = await User.findOne({ email });

            if(!user){
                return { error: 'User not found' };
            }

            if(user.isEmailVerified){
                return { error: 'User already verified' };
            }

            await Token.deleteMany({ user: user._id });

            const newOTP = await generateCode();
            await Token.create({
                otp: newOTP,
                user: user._id,
                expiresAt: Date.now() + 10 * 60 * 1000
            });

            await createUserMail(user, newOTP);
            return { message: 'OTP has been sent to the provided email' };
        }catch (error) {
            return { error: 'Internal server error' };
        }
    }

    /**
     * Completes user registration after verifying email, by setting name and password.
     *
     * @param {Object} validated - Validated data from the frontend
     * @param {string} validated.firstName - First name of the user
     * @param {string} validated.lastName - Last name of the user
     * @param {string} validated.password - Password of the user (should be hashed before saving)
     * @param {string} validated.email - Email address of the user
     * @returns {Promise<Object>} Returns the updated user or an error message
     */
    createUser = async (validated) => {
        const { firstName, lastName, password, email } = validated;

        try{
            const user = await User.findOne({email})

            if(!user){
                return { error: 'User not found' };
            }

            user.firstName = firstName;
            user.lastName = lastName;
            user.password = password;
            await user.save();

            return { user }
        }catch (error){
            return { error: 'Internal server error' };
        }
    }
}

module.exports = new AuthService();
