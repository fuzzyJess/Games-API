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

exports.selectReviews = (category, sort_by = 'created_at', order = 'DESC') => {
    
    const paramsArr = [];

    let sqlQuery = `
        SELECT reviews.*, COUNT(comments.review_id) ::INT AS comment_count 
        FROM reviews
        LEFT JOIN comments 
        ON reviews.review_id = comments.review_id `;

    if (category !== undefined) {
        if (category) {
            if (![
                'strategy',
                'social deduction',
                'hidden-roles',
                'dexterity',
                'push-your-luck',
                'roll-and-write',
                'deck-building',
                'engine-building',
                'euro game',
                "children's games"
            ].includes(category)) {
                return Promise.reject({ status: 400, msg: 'Invalid category provided' });
            }
            paramsArr.push(category);
            sqlQuery += `WHERE reviews.category = $1 `
        }
    }

    
    if (![
        'review_id',
        'title',
        'category',
        'designer',
        'owner',
        'created_at',
        'votes',
        'comment_count'
        ].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid order provided' });
        }
        
    if (![
        'DESC',
        'ASC'
    ].includes(order.toUpperCase())) {
        return Promise.reject({ status: 400, msg: 'Invalid order provided' });
    }

    
 sqlQuery +=
        `GROUP BY reviews.review_id `

    
    sqlQuery += `ORDER BY ${sort_by.toUpperCase()} ${order.toUpperCase()};`
    console.log(sqlQuery, "<query being passed to db", paramsArr, "< paramsArr")
    return db.query(sqlQuery, paramsArr)
        .then((data) => {

            const reviews = data.rows;
            
            if (!reviews) {
                return Promise.reject({
                    status: 404,
                    msg: "Review ID not found"
                });
            }
            
            return reviews;
        }).catch(err => {
           //console.log(err)
        })

}

exports.selectComments = (review_id) => {

    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`, [review_id])
        .then((data) => {
            const comments = data.rows;
            return comments;
        })
}

exports.addComment = (review_id, body, username) => {

    return db.query(`
    INSERT INTO comments
    (body, review_id, author)
    VALUES 
    ($1, $2, $3)
    RETURNING *;
    `, [body, review_id, username])
        .then((data) => {
            const comment = data.rows[0];
            if (comment === undefined) {
                return Promise.reject({
                    status: 400, msg: "Missing input value"
                });
            }
            if (!comment) {
                return Promise.reject({
                    status: 404,
                    msg: "Review ID not found"
                });
            }
            return comment;
        })


}