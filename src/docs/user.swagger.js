/**
 * @swagger
 * tags:
 *   name: User
 *   description: User authenticated endpoints
 */

/**
 * @swagger
 * /user/refresh-token:
 *   post:
 *     summary: Refresh access token using a valid refresh token from cookies
 *     tags: [User]
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user and clear refresh token cookie
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     isEmailVerified:
 *                       type: boolean
 *                     role:
 *                       type: string
 *                     whenLastActive:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 */
