const express = require("express");
const router = express.Router();

const db = require("../db");

//Test
router.get("/", (req, res) => {

    const sql = `
        SELECT * FROM activities
        ORDER BY activity_date DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(rows);
    });
});

module.exports = router;