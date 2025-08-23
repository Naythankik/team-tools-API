const AuthController = require('../../controllers/authController');
const AuthService = require('../../services/authService');
const { errorResponse, successResponse } = require('../../utils/responseHandler');
const { verifyOTPRequest } = require('../../requests/authRequest');
const userResource = require('../../resources/userResource');

jest.mock('../../services/authService');
jest.mock('../../requests/authRequest');
jest.mock('../../utils/responseHandler');
jest.mock('../../resources/userResource');

describe('AuthController.verifyOTP', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { email: 'test@example.com', otp: '123456' } };
        res = {};
        jest.clearAllMocks();
    });

    it('should return 400 if validation fails', async () => {
        verifyOTPRequest.mockReturnValue({
            error: { details: [{ message: 'OTP is required' }] }
        });

        await AuthController.verifyOTP(req, res);

        expect(errorResponse).toHaveBeenCalledWith(
            res,
            'Validation Errors',
            400,
            ['OTP is required']
        );
    });

    it('should return 400 if service returns an error', async () => {
        verifyOTPRequest.mockReturnValue({ value: req.body });
        AuthService.verifyOTP.mockResolvedValue({ error: 'Invalid OTP' });

        await AuthController.verifyOTP(req, res);

        expect(errorResponse).toHaveBeenCalledWith(res, 'Invalid OTP', 400);
    });

    it('should return 201 if OTP is verified successfully', async () => {
        const fakeUser = { id: 1, email: 'test@example.com' };
        verifyOTPRequest.mockReturnValue({ value: req.body });
        AuthService.verifyOTP.mockResolvedValue({
            user: fakeUser,
            message: 'OTP verified',
            registrationToken: 'abc123'
        });
        userResource.mockReturnValue(fakeUser);

        await AuthController.verifyOTP(req, res);

        expect(successResponse).toHaveBeenCalledWith(
            res,
            'OTP verified',
            { user: fakeUser, token: 'abc123' },
            201
        );
    });

    it('should return 500 on unexpected errors', async () => {
        verifyOTPRequest.mockReturnValue({ value: req.body });
        AuthService.verifyOTP.mockRejectedValue(new Error('DB down'));

        await AuthController.verifyOTP(req, res);

        expect(errorResponse).toHaveBeenCalledWith(
            res,
            'Internal Server Error',
            500,
            'DB down'
        );
    });
});
