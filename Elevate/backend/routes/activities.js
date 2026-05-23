const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/:date", (req, res) => {

	const date = req.params.date;

	const sql = `
		SELECT
			id,
			title,
			description,
			activity_date,
			duration_min,
			completed
		FROM activities
		WHERE activity_date = ?
		ORDER BY activity_date DESC
	`;

	db.all(sql, [date], (err, rows) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(rows);

	});

});

router.post("/", (req, res) => {

	const {
		name,
		duration,
		repeat,
		date
	} = req.body;

	const sql = `
		INSERT INTO activities (
			user_id,
			type,
			title,
			description,
			activity_date,
			duration_min,
			completed
		)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`;

	db.run(
		sql,
		[
			1,
			'fitness',
			name,
			repeat,
			date,
			duration,
			0
		],
		function(err) {

			if(err) {
				return res.status(500).json(err);
			}

			res.json({
				success: true,
				id: this.lastID
			});

		}
	);

});

router.patch("/:id/toggle", (req, res) => {

	const id = req.params.id;

	const sql = `
		UPDATE activities
		SET completed = NOT completed
		WHERE id = ?
	`;

	db.run(sql, [id], function(err) {

		if(err) {
			return res.status(500).json(err);
		}

		res.json({
			success: true
		});

	});

});

module.exports = router;