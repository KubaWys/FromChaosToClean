const request = require('supertest');
const app = require('../server');

describe('Product Routes', () => {
  it('GET /api/products should return 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
