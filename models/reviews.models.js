const db = require("../db/connection");

exports.selectReview = (id) => {
    return db.query(`
    SELECT reviews.*, COUNT(comments.review_id) ::INT AS comment_count 
    FROM reviews
    LEFT JOIN comments 
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`, [id])
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

exports.selectReviews = (category) => {
    const categoryArr = [];
    let sqlQuery = `
    SELECT reviews.*, COUNT(comments.review_id) ::INT AS comment_count 
    FROM reviews
    LEFT JOIN comments 
    ON reviews.review_id = comments.review_id `;
    
    if (category) {
        sqlQuery += `WHERE reviews.category = $1`
        categoryArr.push(category);
    }
    sqlQuery +=
    `GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`

    return db.query(sqlQuery, categoryArr)
        .then((data) => {

            const reviews = data.rows;

            if (!reviews) {
                return Promise.reject({
                    status: 404,
                    msg: "Review ID not found"
                });
            }
            return reviews;
        })
}