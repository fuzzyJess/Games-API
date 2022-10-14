const db = require("../db/connection");

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then((data) => {
        const users = data.rows;
        return users;
    });
}

exports.selectUser = (username) => {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1;`, [username])
    .then((data) => {

        if (data.rows.length === 0) {
            return Promise.reject({
                status: 400,
                msg: "Not a valid username"
            });
        }
        const user = data.rows;
        return user;
    })
}