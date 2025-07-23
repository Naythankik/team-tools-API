const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const { generateCode, generateToken, generateJwtToken} = require("../utils/token");
const { createUserMail } = require("../utils/mail");
const {errorResponse} = require("../utils/responseHandler");
const UserResource = require("../resources/userResource");

/**
 * Service class for authentication-related logic.
 */
class AuthService {

    /**
     * Creates a new user if the email does not already exist.
     *
     * @param {Object} validatedData - Validated data containing user details
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

            const registrationToken = await generateToken(72);

            user.isEmailVerified = true;
            user.registrationToken = registrationToken;
            await user.save();

            // Cleanup token
            await Token.deleteMany({ user: user._id });

            return { user, registrationToken };
        }catch (error){
            return { error: 'Internal server error' };
        }
    };

    /**
     * Sends a new OTP to the user's email address.
     *
     * @param {Object} validatedData - Validated data containing user details
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
     * @param token
     * @returns {Promise<Object>} Returns the updated user or an error message
     */
    createUser = async (validated, token) => {
        const { firstName, lastName, password } = validated;

        try{
            const user = await User.findOne({registrationToken: token})

            if(!user){
                return { error: 'User not found' };
            }

            user.firstName = firstName;
            user.lastName = lastName;
            user.password = password;
            user.registrationToken = undefined;

            await user.save();
            return { user }
        }catch (error){
            return { error: 'Internal server error' };
        }
    }

    /**
     * * Authenticates a user and returns a JWT access token with user details.
     *
     * @param res
     * @param identifier
     * @param password
     * @returns {Promise<{access_token: string, user: object}|*>}
     */
    loginUser = async (res, { identifier, password }) => {
        // identifier can be email or username
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        }).select('+password');

        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        if (!user.isEmailVerified) {
            return errorResponse(res, 'Account not verified', 403);
        }

        // Generate JWT
        const accessToken = generateJwtToken(user, '15m')
        const refreshToken = generateJwtToken(user, '30d')

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // secure cookie on production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // allow cross-site if needed
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        user.whenLastActive = new Date();
        user.isActive = true
        await user.save();

        return {
            access_token: accessToken,
            user: UserResource(user)
        };
    };
}

module.exports = new AuthService();
