const AuthController = require('../../controllers/authController');
const AuthService = require('../../services/authService');
const { errorResponse, successResponse } = require('../../utils/responseHandler');
const { registerRequest } = require('../../requests/authRequest');
const userResource = require('../../resources/userResource');

jest.mock('../../services/authService');
jest.mock('../../requests/authRequest');
jest.mock('../../utils/responseHandler');
jest.mock('../../resources/userResource');

describe('AuthController.completeRegistration', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { email: 'test@example.com', password: '123456' },
            params: { token: 'abc123' },  // default token location
            query: {},
            headers: {}
        };
        res = {};
    });

    it('should return 400 if validation fails', async () => {
        registerRequest.mockReturnValue({
            error: { details: [{ message: 'Password too short' }] }
        });

        await AuthController.completeRegistration(req, res);

        expect(errorResponse).toHaveBeenCalledWith(
            res,
            'Validation Errors',
            400,
            ['Password too short']
        );
    });

    it('should return 400 if no token is provided', async () => {
        registerRequest.mockReturnValue({ value: req.body });
        req.params = {};
        req.query = {};
        req.headers = {};

        await AuthController.completeRegistration(req, res);

        expect(errorResponse).toHaveBeenCalledWith(
            res,
            'Registration token is required',
            400
        );
    });

    it('should return 400 if service returns an error', async () => {
        registerRequest.mockReturnValue({ value: req.body });
        AuthService.createUser.mockResolvedValue({ error: 'Token invalid' });

        await AuthController.completeRegistration(req, res);

        expect(errorResponse).toHaveBeenCalledWith(res, 'Token invalid', 400);
    });

    it('should return 201 if user is created successfully', async () => {
        const fakeUser = { id: 1, email: 'test@example.com' };
        registerRequest.mockReturnValue({ value: req.body });
        AuthService.createUser.mockResolvedValue({
            user: fakeUser,
            message: 'User created successfully'
        });
        userResource.mockReturnValue(fakeUser);

        await AuthController.completeRegistration(req, res);

        expect(successResponse).toHaveBeenCalledWith(
            res,
            'User created successfully',
            { user: fakeUser },
            201
        );
    });

    it('should return 500 on unexpected errors', async () => {
        registerRequest.mockReturnValue({ value: req.body });
        AuthService.createUser.mockRejectedValue(new Error('DB down'));

        await AuthController.completeRegistration(req, res);

        expect(errorResponse).toHaveBeenCalledWith(
            res,
            'Internal Server Error',
            500,
            'DB down'
        );
    });
});
