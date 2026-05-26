const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/:userId", (req, res) => {

	const userId = req.params.userId;

	const sql = `
		SELECT *
		FROM statistics
		WHERE user_id = ?
		ORDER BY stat_date ASC
	`;

	db.all(sql, [userId], (err, rows) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(rows);

	});

});

module.exports = router;