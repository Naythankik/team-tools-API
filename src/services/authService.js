const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const { generateCode, generateToken, generateJwtToken, verifyJwtToken} = require("../utils/token");
const { createUserMail, createForgotPasswordMail} = require("../utils/mail");
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

            if (existingUser) {
                const token = existingUser.token;

                const isTokenExpired = !token || token.expiresAt <= Date.now();

                if (isTokenExpired) {
                    await Token.deleteMany({ user: existingUser._id });

                    const newOtp = await generateCode();
                    await Token.create({
                        otp: newOtp,
                        user: existingUser._id,
                        expiresAt: Date.now() + 10 * 60 * 1000,
                    });
                    await createUserMail(existingUser, newOtp);

                    return {
                        user: existingUser,
                        message: 'A new token has been generated.',
                    };
                }

                // Token still valid
                return {
                    message: 'Token has already been sent. Please check your email.',
                };
            }

            // No user exists
            const user = await User.create({ email });

            const otp = await generateCode();
            await Token.create({
                otp,
                user: user._id,
                expiresAt: Date.now() + 10 * 60 * 1000,
            });
            await createUserMail(user, otp);

            return {
                user,
                message: 'User created successfully',
            };

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

        try {
            const user = await User.findOne({ email }).populate('token');

            if (!user) {
                return { error: 'User not found' };
            }

            if (user.isEmailVerified) {
                return { error: 'User already verified' };
            }

            const token = user.token;

            if (!token || !token.otp) {
                return { error: 'OTP token not found or invalid' };
            }

            if (token.otp !== otp) {
                return { error: 'OTP is incorrect. Try again.' };
            }

            if (token.expiresAt < Date.now()) {
                return { error: 'OTP has expired. Request a new one.' };
            }

            const registrationToken = await generateToken(72);

            user.isEmailVerified = true;
            user.registrationToken = registrationToken;
            await user.save();

            await Token.deleteMany({ user: user._id });

            return {
                user,
                registrationToken,
                message: 'Email successfully verified',
            };
        } catch (error) {
            console.error(error);
            return { error: 'Internal server error' };
        }
    };

    /**
     * Sends a new OTP to the user's email address.
     *
     * @param {Object} validatedData - Validated data containing user details
     * @returns {Promise<Object>} Returns a success message or an error object
     */

    requestNewOTP = async (validatedData) => {
        const { email } = validatedData;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return { error: 'User not found' };
            }

            if (user.isEmailVerified) {
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

            return {
                message: 'OTP has been sent to the provided email',
                user
            };
        } catch (error) {
            console.error(error);
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

        try {
            const user = await User.findOne({ registrationToken: token });

            if (!user) {
                return { error: 'User not found or token is invalid/expired' };
            }

            user.firstName = firstName;
            user.lastName = lastName;
            user.password = password; // Make sure this gets hashed in your User model
            user.registrationToken = undefined;

            await user.save();

            return {
                user,
                message: 'User profile completed successfully',
            };
        } catch (error) {
            console.error('[createUser]', error);
            return { error: 'Internal server error' };
        }
    };

    /**
     * * Authenticates a user and returns a JWT access token with user details.
     *
     * @param res
     * @param identifier
     * @param password
     * @returns {Promise<{access_token: string, user: object}|*>}
     */

    loginUser = async ({ identifier, password }) => {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid credentials');
        }

        if (!user.isEmailVerified) {
            throw new Error('Account not verified');
        }

        const accessToken = generateJwtToken(user, '15m');
        const refreshToken = generateJwtToken(user, '30d');

        user.whenLastActive = new Date();
        user.isActive = true;
        await user.save();

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: UserResource(user)
        };
    };

    forgotPassword = async ({ email }) => {
        try{
            const user = await User.findOne({ email });

            if (!user) {
                return { message: 'If an account with that email exists, a password reset link has been sent.' };
            }

            if (user.resetPasswordToken && user.resetPasswordExpires > Date.now()) {
                return {
                    message: 'A reset link was recently sent. Please check your email or wait a few minutes before requesting again.'
                };
            }

            const token = await generateToken(144);
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

            await user.save({ validateBeforeSave: false });
            await createForgotPasswordMail(user, token);

            return {
                message: `A password reset link has been sent to ${email}. Please check your inbox and spam folder.`
            };
        }catch (error){
            console.log(error)
            return { error: 'Internal server error' };
        }
    }

    resetPassword = async ({ identifier, token, newPassword, confirmPassword }) => {
        if (newPassword !== confirmPassword) {
            return { error: 'Passwords do not match'};
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
            resetPasswordToken: token
        });

        if (!user) {
            return { error: 'Invalid reset token or email/username.' };
        }

        if (user.resetPasswordExpires < Date.now()) {
            return { error: 'Reset token has expired. Please request a new one.' };
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { message: 'Password reset successful' };
    };

    refreshToken = async (token) => {
        const decoded = verifyJwtToken(token);

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            throw new Error('Invalid or inactive user');
        }

        const newAccessToken = generateJwtToken(user, '15m');
        const newRefreshToken = generateJwtToken(user, '30d');

        return  {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }

}

module.exports = new AuthService();
