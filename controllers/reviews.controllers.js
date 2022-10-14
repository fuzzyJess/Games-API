const { get } = require('../app.js');
const { selectReview, updateReview, selectReviews, selectComments } = require('../models/reviews.models.js');

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
