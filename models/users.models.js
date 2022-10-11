const db = require("../db/connection");

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then((data) => {
        const users = data.rows;
        if (!users) {
            return Promise.reject({
                status: 400,
                msg: "Invalid query"
            });
        }
        return users;
    });
}