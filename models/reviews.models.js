const db = require("../db/connection");

exports.selectReview = (id) => {
    
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`,  [id])
    .then((data) => {
        const review = data.rows[0];
        if (!review) {
            return Promise.reject({
                status: 400,
                msg: "Review ID not found"
            });
        }
        return review;
    })
}