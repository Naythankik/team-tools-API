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
     * @returns {Promise<Object|string>} Returns an object with `user` if created, or `error` if user doesn't exist
     */
    createUser = async (validatedData) => {
        const { email } = validatedData;

        try {
            const existingUser = await User.findOne({ email }).populate('token', 'expiresAt');

            // If the user already exists
            if (existingUser) {
                const token = existingUser.token;

                if (token && token.expiresAt > Date.now()) {
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
            await Token.create({ otp, user: user._id });
            await createUserMail(user, otp);

            return { user };
        } catch (e) {
            console.error(e);
            return 'Internal server error';
        }
    };

    /**
     * Verify the user token if the email does not already exist.
     *
     * @param {Object} validatedData - Validated data containing user details
     * @param {string} validatedData.email - Email address of the user
     * @param {string} validatedData.otp - OTP sent to the user mail
     * @returns {Promise<Object|string>} Returns an object with `user` if verified, or `error` if user exists
     */
    verifyOTP = async (validatedData) => {
        const { otp, email } = validatedData;

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
            // Optionally delete expired token
            await Token.deleteMany({ user: user._id });

            // Generate a new token (optional - depending on flow)
            const newOTP = await generateCode();
            await Token.create({
                otp: newOTP,
                user: user._id,
                expiresAt: Date.now() + 10 * 60 * 1000
            });

            await createUserMail(user, newOTP);

            return { error: 'OTP has expired. A new one has been sent.' };
        }

        // All good — verify users
        user.isEmailVerified = true;
        await user.save();

        // Cleanup token
        await Token.deleteMany({ user: user._id });

        return { user };
    };


}

module.exports = new AuthService();
