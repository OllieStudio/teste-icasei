// __tests__/index.test.js
const request = require('supertest');
const server = require('../../bff/src/index'); // Adjust the path if necessary

describe('YouTube Search API', () => {
    it('should return videos with a favorite property', async () => {
        const response = await request(server)
            .post('/api/search')
            .send({ query: 'nodejs', favorites: ['videoId1', 'videoId2'] });
        
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach(video => {
            expect(video).toHaveProperty('favorite');
        });
    });

    it('should return error for missing query', async () => {
        const response = await request(server)
            .post('/api/search')
            .send({ favorites: [] });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
