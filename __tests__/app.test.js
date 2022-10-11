const app = require('../app');
const request = require('supertest');
const db = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed")
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));

afterAll(() => {
    if (db.end) db.end();
});

describe("GET requests", () => {
    describe("3.GET /api/categories", () => {
        test("status: 200, responds with an array of category objects", () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
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
        });
    });
    describe("4.GET /api/reviews/",() => {
        test("status: 200, responds with a review object containing the correct properties", () => {
            return request(app)
            .get("/api/reviews/3")
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object);
                expect(review).toEqual({
                    review_id: 3,
                    title: 'Ultimate Werewolf',
                    designer: 'Akihisa Okui',
                    owner: 'bainesface',
                    review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: "We couldn't find the werewolf!",
                    category: 'social deduction',
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 5
                  });
            })
        })
    })
})

describe("Error handling", () => {
    test("status: 404, incorrect api/categories, responds with 'Path not found' message", () => {
        return request(app)
            .get("/api/kategories")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Path not found");
            })
    });
    test("status: 404, incorrect api/reviews, responds with 'Path not found' message", () => {
        return request(app)
            .get("/api/reviows")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Path not found");
            })
        
    });

});