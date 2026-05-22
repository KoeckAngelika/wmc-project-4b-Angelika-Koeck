const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    "./database/elevate_fitness_app.sqlite",
    (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("SQLite verbunden");
        }
    }
);

module.exports = db;