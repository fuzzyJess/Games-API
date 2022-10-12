const db = require("../db/connection");

exports.selectReview = (id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`,  [id])
    .then((data) => {
        const review = data.rows[0];
        if (!review) {
            return Promise.reject({
                status: 404,
                msg: "Review ID not found"
            });
        }
        return review;
    })
}

exports.updateReview = (id, votes) => {
    const incVotes = votes.inc_votes;
    return db.query(`UPDATE reviews 
    SET votes = votes + $1 
    WHERE review_id = $2 RETURNING *;`, [incVotes, id])
    .then((data) => {
        const review = data.rows[0];
        if (!review) {
            return Promise.reject({
                status: 404,
                msg: "Review ID not found"
            });
        }
        return review;
    })
}