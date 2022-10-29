const db = require("../db/connection");

exports.removeComments = (id) => {
   
    return db.query(
    `DELETE FROM comments
    WHERE comment_id = ${id}
    RETURNING *;`)
    
    .then((data) => {
        const comments = data.rows;
        if (!comments) {
            return Promise.reject({
                status: 400,
                msg: "Invalid query"
            });
        }
        return comments;
    });
}
