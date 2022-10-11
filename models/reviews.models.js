const db = require("../db/connection");

exports.selectReview = (id) => {
    
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`,  [id])
    .then((data) => {
        const review = data.rows[0];
        return review;
    })
}