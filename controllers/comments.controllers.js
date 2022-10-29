const { removeComments } = require('../models/comments.models.js');

exports.deleteComments = (req, res, next) => {
    removeComments(req.params.comment_id)
    .then((comments) => res.status(204).send({comments}))
    .catch((err) => {
        next(err);
    });
}
