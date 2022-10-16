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
    describe("4.GET /api/reviews/:review_id", () => {
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
                        votes: 5,
                        comment_count: 3
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
    describe("8.GET /api/reviews/?category=dexterity", () => {
        test("status: 200, responds with array of one review object when category provided only matches one", () => {
            return request(app)
                .get("/api/reviews/?category=dexterity")
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body;
                    expect(reviews).toHaveLength(1);
                    expect(reviews).toBeInstanceOf(Array);
                    expect(reviews).toBeSorted("created_at", { descending: true })
                    reviews.forEach((review) => {
                        expect.objectContaining({
                            review_id: expect.any(Number),
                            title: expect.any(String),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            review_img_url: expect.any(String),
                            review_body: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(Number),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    })
                })
        })
        test("status: 200, responds with array of review objects sorted by date when category provided", () => {
            return request(app)
                .get("/api/reviews/?category=social deduction")
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body;
                    expect(reviews).toHaveLength(11);
                    expect(reviews).toBeInstanceOf(Array);
                    expect(reviews).toBeSorted("created_at", { descending: true })
                })
        })
        test("status: 200, responds with array of all review objects sorted by date when no category provided", () => {
            return request(app)
                .get("/api/reviews/")
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body;
                    expect(reviews).toHaveLength(13);
                    expect(reviews).toBeInstanceOf(Array);
                    expect(reviews).toBeSorted("created_at", { descending: true })
                })
        })
    })
    describe("9.GET /api/reviews/:review_id/comments", () => {
        test("status: 200, responds with array of comment objects sorted in date order that match review_id", () => {
            return request(app)
                .get("/api/reviews/3/comments")
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body;
                    expect(comments).toHaveLength(3);
                    expect(comments).toBeInstanceOf(Array);
                    expect(comments).toBeSorted("created_at", { descending: true })
                    comments.forEach((comment) => {
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            review_id: expect.any(Number)
                        })
                    })
                })
        })
    })
    describe("11.GET /api/reviews/?sort_by=date_order=desc", () => {
        test.only("returns data sorted by default of date and order default of desc", () => {
            return request(app)
                .get("/api/reviews/?sort_by=created_at&order=desc")
                .expect(200)
                .then(({body}) => {
                    const reviews  = body.reviews;
                    expect(reviews).toHaveLength(11);
                    expect(reviews).toBeInstanceOf(Array);
                    expect(reviews).toBeSorted("created_at", { descending: true })
                    reviews.forEach((review) => {
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            review_id: expect.any(Number)
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
                            votes: 8,
                        })
                    })
            })
        })
    })

    describe("POST requests", () => {
        describe("10.POST /api/reviews/:review_id/comments", () => {
            test("status: 201, responds with the posted comment", () => {
                return request(app)
                    .post("/api/reviews/13/comments")
                    .send({ username: "bainesface", body: "Formed a rubble alliance" })
                    .expect(201)
                    .then(({ body }) => {
                        const { newComment } = body;
                        expect(newComment.body).toBe('Formed a rubble alliance');
                        expect(newComment.author).toBe('bainesface');
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
                test("Get reviews valid review_id type but not in database, responds with 'Review ID not found' message", () => {
                    return request(app)
                        .get("/api/reviews/95")
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Review ID not found")
                        })
                })
                test("GET comments - valid review_id type but not in database", () => {
                    return request(app)
                        .get("/api/reviews/2000/comments")
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
            describe("POST requests", () => {
                test("valid review_id but doesn't exist in database, responds with 'Review ID not found' message", () => {
                    return request(app)
                        .post("/api/reviews/2330/comments")
                        .send({ username: "bainesface", body: "Formed a rubble alliance" })
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Not a valid input")
                        })
                })
            })
        })
        describe("status 400 errors", () => {
            describe("GET requests", () => {
                test("Get reviews invalid review_id, responds with 'Not a vaild Review ID' message", () => {
                    return request(app)
                        .get("/api/reviews/bananas")
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Not a vaild ID number")
                        })
                })
                test("GET comments - invalid review_id, responds with 'Not a vaild Review ID' message", () => {
                    return request(app)
                        .get("/api/reviews/bananas/comments")
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Not a vaild ID number")
                        })
                })
                test("invalid category, responds with 'Invalid category provided' message", () => {
                    return request(app)
                        .get("/api/reviews?category=dexterititity")
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Invalid category provided")
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
            describe("POST requests", () => {

                test("passed empty object, responds with 'Missing input value", () => {
                    return request(app)
                        .post("/api/reviews/2/comments")
                        .send({})
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Missing input value")
                        })
                })
                test("invalid username, responds with 'Not a valid username' message", () => {
                    return request(app)
                        .post("/api/reviews/1/comments")
                        .send({ username: "totoro", body: "Toootooroo!" })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Not a valid username")
                        })
                })
            })
        })
    });