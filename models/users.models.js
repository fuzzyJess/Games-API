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
        const user = data.rows;
        return user;
    })
}