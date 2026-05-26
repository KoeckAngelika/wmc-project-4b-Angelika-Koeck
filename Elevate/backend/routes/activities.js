const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/:userId/:date", (req, res) => {

	const userId = req.params.userId;
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
		WHERE
			user_id = ?
			AND activity_date = ?
		ORDER BY activity_date DESC
	`;

	db.all(sql,[userId,date],(err, rows) => {

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
		date,
		user_id
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
			user_id,
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

	// activity holen
	db.get(
		`
		SELECT *
		FROM activities
		WHERE id = ?
		`,
		[id],
		(err, activity) => {

			if(err) {
				return res.status(500).json(err);
			}

			if(!activity) {
				return res.status(404).json({
					error: "Activity not found"
				});
			}

			// completed toggeln
			db.run(
				`
				UPDATE activities
				SET completed = NOT completed
				WHERE id = ?
				`,
				[id],
				function(err) {

					if(err) {
						return res.status(500).json(err);
					}

					// nur wenn task gerade abgeschlossen wurde
					if(activity.completed === 0) {

						const today = activity.activity_date;

						// statistik updaten
						db.run(
							`
							INSERT INTO statistics (
								user_id,
								stat_date,
								steps,
								calories_burned
							)
							VALUES (?, ?, ?, ?)

							ON CONFLICT(user_id, stat_date)
							DO UPDATE SET
								steps = steps + excluded.steps,
								calories_burned = calories_burned + excluded.calories_burned
							`,
							[
								activity.user_id,
								today,
								4000,
								300
							],
							(err) => {

								if(err) {
									console.log(err);
								}

							}
						);

					}

					res.json({
						success: true
					});

				}
			);

		}
	);

});

router.delete("/:id", (req, res) => {

	const id = req.params.id;

	const sql = `
		DELETE FROM activities
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

router.get("/single/:id", (req, res) => {

	const id = req.params.id;

	const sql = `
		SELECT *
		FROM activities
		WHERE id = ?
	`;

	db.get(sql, [id], (err, row) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(row);

	});

});

router.get("/single/:id", (req, res) => {

	const id = req.params.id;

	const sql = `
		SELECT *
		FROM activities
		WHERE id = ?
	`;

	db.get(sql, [id], (err, row) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(row);

	});

});

router.put("/:id", (req, res) => {

	const id = req.params.id;

	const {
		name,
		duration,
		repeat
	} = req.body;

	const sql = `
		UPDATE activities
		SET
			title = ?,
			description = ?,
			duration_min = ?
		WHERE id = ?
	`;

	db.run(
		sql,
		[
			name,
			repeat,
			duration,
			id
		],
		function(err) {

			if(err) {
				return res.status(500).json(err);
			}

			res.json({
				success: true
			});

		}
	);

});

module.exports = router;