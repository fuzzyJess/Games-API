const { selectReview, updateReview, selectReviews } = require('../models/reviews.models.js');

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
    const category = req.query.sort_by;
    selectReviews(category)
        .then((reviews) => res.status(200)
            .send({ reviews }))
        .catch((err) => {
            next(err);
        })
}
