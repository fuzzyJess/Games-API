const fs = require("fs/promises");

exports.selectApiEndpoints = () => {
    return fs.readFile("endpoints.json").then((res) => {
        return JSON.parse(res);
    });
};