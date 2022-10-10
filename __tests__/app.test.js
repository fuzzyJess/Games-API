const app = require('../app');

const request = require('supertest');

const db = require("../db/data/test-data/index");

const seed = require("../db/seeds/seed")

const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));

afterAll(() => {
    if (db.end) db.end();
});

describe("3.GET /api/categories", () => {
    test("status: 200, responds with an array of category objects", () => {
        return request(app)
        .get("/api/categories")
        .then(({ body }) => {
            const { categories } = body;
            expect(categories).toHaveLength(4);
            expect(categories).toBeInstanceOf(Array);
            categories.forEach((category) => {
                expect.objectContaining({
                    category_slug: expect.any(String),
                    category_description: expect.any(String)
                })
            })
        })
    })

    console.log("testing...")
})
// describe("Error handling", () => {
//     test("status: 404, responds with 'path not found' message", () => {
//         return request(app)
//             .get
//     })

// })