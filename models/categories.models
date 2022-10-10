const db = require("../db/connection");

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`)
    
    .then((data) => {
        const categories = data.rows;
        if (!categories) {
            return Promise.reject({
                status: 400,
                msg: "Invalid query"
            });
        }
        return categories;
    });
}