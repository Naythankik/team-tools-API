const transporter = require('../config/mailer');

/**
 * Sends a welcome email with token (OTP) to a newly created user.
 *
 * @param {Object} user - The user object
 * @param {string} user.email - User's email address
 * @param {string} user.username - User's username
 * @param {string|number} token - OTP or activation token
 */

const createUserMail = async (user, token) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.APP_MAIL}>`,
            to: `"${user.username || user.email}" <${user.email}>`,
            subject: `Your ${process.env.APP_NAME} Verification Code`,
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

module.exports = {
    createUserMail
};
