const app = require('../app');
const request = require('supertest');
const db = require("../db/connection");
const seed = require("../db/seeds/seed")
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));

afterAll(() => db.end());


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
    describe("4.GET /api/reviews/", () => {
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
    describe("5.GET /api/users", () => {
        test("status: 200, responds with array of user objects", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    const { users } = body;
                    expect(users).toHaveLength(4);
                    expect(users).toBeInstanceOf(Array);
                    users.forEach((user) => {
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    })
                })
        })
    })
})
describe("PATCH requests", () => {
    describe("6.PATCH /api/reviews", () => {
        test("status: 201, responds with the update review", () => {
            return request(app)
                .patch("/api/reviews/2")
                .send({ inc_votes: 3 })
                .expect(201)
                .then(({ body }) => {
                    const { updatedReview } = body;
                        expect(updatedReview).toEqual({
                        review_id: 2,
                        title: 'Jenga',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_img_url:
                            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Fiddly fun for all the family',
                        category: 'dexterity',
                        created_at: "2021-01-18T10:01:41.251Z",
                        votes: 8
                    })
                })
        })
    })
})

describe("Error handling", () => {
    describe("status 404 errors", () => {
        describe("GET requests", () => {
            test("incorrect api path, responds with 'Path not found' message", () => {
                return request(app)
                    .get("/api/kategories")
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe("Path not found");
                    })
            });
            test("valid review_id type but not in database, responds with 'Review ID not found' message", () => {
                return request(app)
                    .get("/api/reviews/95")
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe("Review ID not found")
                    })
            })
        })
        describe("PATCH requests", () => {
            test("incorrect api path, responds with 'Path not found' message", () => {
                return request(app)
                .patch("/api/reviewy/1")
                .send({ inc_votes: 3 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Path not found");
                })
            })
            test("valid review_id type but not in database, responds with 'Review ID not found' message", () => {
                return request(app)
                    .patch("/api/reviews/95")
                    .send({ inc_votes: 3 })
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe("Review ID not found")
                    })
            })
        })
    })
    describe("status 400 errors", () => {
        describe("GET requests", () => {
            test("invalid review_id, responds with 'Not a vaild Review ID' message", () => {
                return request(app)
                    .get("/api/reviews/bananas")
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe("Not a vaild ID number")
                    })
            })
        })
        describe("PATCH requests", () => {
            test("invalid review_id, responds with 'Not a vaild Review ID' message", () => {
                return request(app)
                    .patch("/api/reviews/bananas")
                    .send({ inc_votes: 3 })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe("Not a vaild ID number")
                    })
            })
            test("wrong data type, responds with 'Wrong data type' message", () => {
                return request(app)
                    .patch("/api/reviews/2")
                    .send({ inc_votes: 'banana' })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe("Wrong data type")
                    })
            })
            test("when passed empty object in request, responds with 'Missing key value pair' message", () => {
                return request(app)
                .patch("/api/reviews/2")
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Missing input value")
                })
            })
        })
    })
});