const AuthController = require('../../controllers/authController');
const AuthService = require('../../services/authService');
const {errorResponse, successResponse} = require("../../utils/responseHandler");
const {emailRequest} = require("../../requests/authRequest");

jest.mock('../../services/authService');
jest.mock('../../requests/authRequest');
jest.mock('../../utils/responseHandler');

describe('AuthController.registerWithEmail', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { email: 'test@example.com', password: '123456' } };
        res = {};
    });

    it('should return 400 if validation fails', async () => {
        emailRequest.mockReturnValue({ error: { details: [{ message: 'Invalid email' }] } });

        await AuthController.registerWithEmail(req, res);

        expect(errorResponse).toHaveBeenCalledWith(res, 'Invalid email', 400);
    });

    it('should return 409 if service returns an error', async () => {
        emailRequest.mockReturnValue({ value: req.body });
        AuthService.createUserEmail.mockResolvedValue({ error: 'Email already exists' });

        await AuthController.registerWithEmail(req, res);

        expect(errorResponse).toHaveBeenCalledWith(res, 'Email already exists', 409);
    });

    it('should return 200 if no user but has a message', async () => {
        emailRequest.mockReturnValue({ value: req.body });
        AuthService.createUserEmail.mockResolvedValue({ user: null, message: 'Check your email' });

        await AuthController.registerWithEmail(req, res);

        expect(successResponse).toHaveBeenCalledWith(res, 'Check your email', {}, 200);
    });

    it('should return 201 if user is created', async () => {
        const fakeUser = { id: 1, email: 'test@example.com' };
        emailRequest.mockReturnValue({ value: req.body });
        AuthService.createUserEmail.mockResolvedValue({ user: fakeUser, message: 'User created successfully' });

        await AuthController.registerWithEmail(req, res);

        expect(successResponse).toHaveBeenCalledWith(
            res,
            'User created successfully',
            { user: expect.any(Object) },
            201
        );
    });

    it('should return 500 on unexpected errors', async () => {
        emailRequest.mockReturnValue({ value: req.body });
        AuthService.createUserEmail.mockRejectedValue(new Error('DB down'));

        await AuthController.registerWithEmail(req, res);

        expect(errorResponse).toHaveBeenCalledWith(res, 'Internal Server Error', 500, 'DB down');
    });
});
