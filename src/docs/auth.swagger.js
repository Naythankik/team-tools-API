/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authenticate endpoints
 */

/**
 * @swagger
 * /auth/register/initialPhase:
 *   post:
 *     summary: Begin user registration by submitting email receive OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Email or telephone already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/register/finalPhase/{token}:
 *   post:
 *     summary: Complete registration after email verification using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Registration token from OTP verification
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Complete profile setup
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               username:
 *                 type: string
 *                 example: johndoe123
 *               password:
 *                 type: string
 *                 example: StrongPassword!23
 *     responses:
 *       200:
 *         description: Registration completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *       400:
 *         description: Invalid token or missing fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/register/verify-email:
 *   post:
 *     summary: Verify user's email with the OTP sent
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 845920
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/register/request-otp:
 *   post:
 *     summary: Resend verification OTP to user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP resent
 *       400:
 *         description: Email not found or already verified
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user using email or username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123!
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send a password reset link or OTP to the user's email
 *     tags: [Auth]
 *     requestBody:
 *       description: User identifier (email or username)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password using token
 *     tags: [Auth]
 *     requestBody:
 *       description: Provide identifier, token, and new passwords
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - token
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: user@example.com
 *               token:
 *                 type: string
 *                 example: 923874
 *               newPassword:
 *                 type: string
 *                 example: newPassword123!
 *               confirmPassword:
 *                 type: string
 *                 example: newPassword123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */

