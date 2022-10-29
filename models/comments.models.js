const db = require("../db/connection");

exports.removeComments = (id) => {
   
    return db.query(
    `DELETE FROM comments
    WHERE comment_id = ${id}
    RETURNING *;`)
    .then((data) => {
        const comments = data.rows[0];
        if (!comments) {
            return Promise.reject({
                status: 404,
                msg: "Comment ID not found"
            });
        }
        return comments[0];
    });
}
