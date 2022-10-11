const { selectReview } = require('../models/reviews.models.js');

exports.getReview = (req, res, next) => {
    selectReview(req.params.review_id)
    .then((review) => res.status(200)
    .send({ review }))
    .catch((err) => {
        next(err);
    })
}