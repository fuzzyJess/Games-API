const { get } = require('../app.js');
const { selectReview, updateReview, selectReviews, selectComments, addComment } = require('../models/reviews.models.js');
const { selectUser } = require("../models/users.models")

exports.getReview = (req, res, next) => {
    selectReview(req.params.review_id)
        .then((review) => res.status(200)
            .send({ review }))
        .catch((err) => {
            next(err);
        })
}

exports.patchReview = (req, res, next) => {
    updateReview(req.params.review_id, req.body)
        .then((updatedReview) => res.status(201)
            .send({ updatedReview }))
        .catch((err) => {
            next(err);
        })
}

exports.getReviews = (req, res, next) => {
    const category = req.query.category;
    selectReviews(category)
        .then((reviews) => res.status(200)
            .send({ reviews }))
        .catch((err) => {
            next(err);
        })
}

exports.getComments = (req, res, next) => {
    const review_id = req.params.review_id;
    selectReview(review_id).then(() => {
        return selectComments(review_id)
    })
        .then((comments) => res.status(200)
            .send({ comments }))
        .catch((err) => {
            next(err);
        })

}

exports.postComment = (req, res, next) => {

    const review_id = req.params.review_id;
    const body = req.body.body;
    const username = req.body.username

    if (!body || !username) {
        next({
            status: 400,
            msg: "Missing input value"
        });
    }

    selectUser(username).then(() => {
        return addComment(review_id, body, username)
    })
        .then((newComment) => res.status(201)
            .send({ newComment }))
        .catch((err) => {
            next(err);
        })
}
