const { selectApiEndpoints } = require('../models/api.models');

exports.getApiEndpoints = (req, res, next) => {
    selectApiEndpoints()
    .then((endpoints) => res.status(200)
    .send({ endpoints }))
    .catch((err) => {
        next(err);
    });
}