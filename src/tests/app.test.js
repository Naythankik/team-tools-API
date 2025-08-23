const request = require('supertest');
const app = require('../../app');

describe('GET /', () => {
    it('should return the default message for undefined routes!', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'Whoops, This is a universal route' });
    });
});
