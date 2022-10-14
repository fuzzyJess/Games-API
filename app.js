const express = require('express');

const { getCategories } = require('./controllers/categories.controllers.js');
const { getReview, patchReview, getReviews, getComments, postComment } = require('./controllers/reviews.controllers.js');
const { getUsers } = require('./controllers/users.controllers.js')

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReview);
app.patch('/api/reviews/:review_id', patchReview);
app.get('/api/reviews/', getReviews);
app.get('/api/reviews/:review_id/comments', getComments);
app.post('/api/reviews/:review_id/comments', postComment);

app.get('/api/users/', getUsers);

// error handling middleware functions

app.use((err, req, res, next) => {
    // handle custom errors
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
});

// app.all to catch any invalid paths not covered by end points above

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found"})
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Not a vaild ID number"})
    } else next(err);
});

app.use((err, req, res, next) => {
    console.log(err, "< err in app.js");
    res.status(500).send({ msg: "Server error" });
});

module.exports = app;
