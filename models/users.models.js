const db = require("../db/connection");

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then((data) => {
        const users = data.rows;
        return users;
    });
}