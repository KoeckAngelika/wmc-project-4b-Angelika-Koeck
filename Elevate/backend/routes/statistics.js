const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/:userId", (req, res) => {

	const userId = req.params.userId;

	const sql = `
		SELECT
			s.stat_date,
			s.steps,
			s.calories_burned,
			s.water_ml,
			s.sleep_hours,
			s.weight_kg

		FROM statistics s

		WHERE
			s.user_id = ?

		AND EXISTS (
			SELECT 1
			FROM activities a

			WHERE
				a.user_id = s.user_id
				AND a.activity_date = s.stat_date
				AND a.completed = 1
		)

		ORDER BY s.stat_date
	`;

	db.all(sql, [userId], (err, rows) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(rows);

	});

});

module.exports = router;