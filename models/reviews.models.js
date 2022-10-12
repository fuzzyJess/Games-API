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

    if (votes.inc_votes === undefined) {
        return Promise.reject({
            status: 400, msg: "Missing input value"
        });
    }

    if (typeof incVotes !== 'number') {
        return Promise.reject({
            status: 400, msg: "Wrong data type"
        });
    }
    
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