const transporter = require('../config/mailer');

/**
 * Sends a welcome email with token (OTP) to a newly created user.
 *
 * @param {Object} user - The user object
 * @param {string|number} token - OTP or activation token
 */
const createUserMail = async (user, token) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.APP_MAIL}>`,
            to: `"${user.username || user.email}" <${user.email}>`,
            subject: `${process.env.APP_NAME} Verification`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Verification Code</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f7;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #fff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                        }
                        .header {
                            background-color: #4f46e5; /* Indigo-600 */
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                        }
                        .header img {
                            height: 40px;
                            margin-bottom: 10px;
                        }
                        .content {
                            padding: 30px;
                            color: #333;
                        }
                        .otp {
                            font-size: 28px;
                            font-weight: bold;
                            letter-spacing: 4px;
                            color: #4f46e5;
                            text-align: center;
                            margin: 20px 0;
                            background-color: #eef2ff;
                            padding: 15px;
                            border-radius: 6px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 13px;
                            padding: 20px;
                            color: #888;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="${process.env.APP_URL}/public/assets/logo.png" alt="${process.env.APP_NAME} Logo" width="50" height="50" style="margin-bottom: 10px;" />
                            <h2>Welcome to ${process.env.APP_NAME}</h2>
                        </div>
                        <div class="content">
                            <p>Hi ${user.username || user.email},</p>
                            <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
                            <div class="otp">${token}</div>
                            <p>This code will expire in 10 minutes. If you didn't request this, you can safely ignore it.</p>
                            <p>Cheers,<br>The ${process.env.APP_NAME} Team</p>
                        </div>
                        <div class="footer">
                            &copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log("Message sent:", info.messageId);
    } catch (err) {
        console.error("Error sending email:", err.message);
    }
};

/**
 * Sends a password-reset email with token (OTP).
 *
 * @param {Object} user - The user object
 * @param {string|number} token - OTP or activation token
 */
const createForgotPasswordMail = async (user, token) => {
    try {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.APP_MAIL}>`,
            to: `"${user.username || user.email}" <${user.email}>`,
            subject: `${process.env.APP_NAME} Password Reset`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f7;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #fff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                        }
                        .header {
                            background-color: #4f46e5;
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                        }
                        .content {
                            padding: 30px;
                            color: #333;
                        }
                        .btn {
                            display: inline-block;
                            background-color: #4f46e5;
                            color: #fff;
                            padding: 12px 20px;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .footer {
                            text-align: center;
                            font-size: 13px;
                            padding: 20px;
                            color: #888;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="${process.env.APP_URL}/public/assets/logo.png" alt="${process.env.APP_NAME} Logo" width="50" height="50" style="margin-bottom: 10px;" />
                            <h2>Password Reset Request</h2>
                        </div>
                        <div class="content">
                            <p>Hi ${user.username || user.email},</p>
                            <p>We received a request to reset your password. Click the button below to proceed:</p>
                            <p style="text-align:center">
                                <a href="${resetUrl}" class="btn">Reset Password</a>
                            </p>
                            <p>If you did not request this, you can safely ignore this email.</p>
                            <p>This link will expire in 15 minutes.</p>
                            <p>Cheers,<br>The ${process.env.APP_NAME} Team</p>
                        </div>
                        <div class="footer">
                            &copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log("Password reset email sent:", info.messageId);
    } catch (err) {
        console.error("Error sending password reset email:", err.message);
    }
};

module.exports = {
    createUserMail,
    createForgotPasswordMail,
};
