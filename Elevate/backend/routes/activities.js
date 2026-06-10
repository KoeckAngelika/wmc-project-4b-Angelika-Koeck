const express = require("express");
const router = express.Router();

const db = require("../db");



router.get("/single/:id", (req, res) => {

	const id = req.params.id;

	const sql = `
		SELECT *
		FROM activities
		WHERE id = ?
	`;

	db.get(sql,[id],(err,row)=>{

		if(err){
			return res.status(500).json(err);
		}

		res.json(row);

	});

});

router.get("/:userId/:date", (req, res) => {

	const userId = req.params.userId;
	const date = req.params.date;

	const sql = `
		SELECT
			a.id,
			a.title,
			a.description,
			a.activity_date,
			a.duration_min,
			a.completed,

			IFNULL(s.steps,0) AS steps,
			IFNULL(s.calories_burned,0) AS calories_burned

		FROM activities a

		LEFT JOIN statistics s
		ON s.user_id = a.user_id
		AND s.stat_date = a.activity_date

		WHERE
			a.user_id = ?
			AND a.activity_date = ?

		ORDER BY a.activity_date DESC
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
		user_id,
		steps,
		calories
	} = req.body;

	const sql = `
		INSERT INTO activities (
			user_id,
			type,
			title,
			description,
			activity_date,
			duration_min,
			steps,
			calories_burned,
			completed
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
			steps || 0,
			calories || 0,
			0
		],
		function(err) {

			if(err) {
				return res.status(500).json(err);
			}

			res.json({
				success:true,
				id:this.lastID
			});

		}
	);

});

router.patch("/:id/toggle", (req,res)=>{

	const id = req.params.id;


	// 1. Activity abhaken / enthaken
	db.run(
		`
		UPDATE activities
		SET completed = NOT completed
		WHERE id = ?
		`,
		[id],
		(err)=>{

			if(err){
				return res.status(500).json(err);
			}


			// 2. Activity holen (wegen User + Datum)
			db.get(
				`
				SELECT *
				FROM activities
				WHERE id = ?
				`,
				[id],
				(err,activity)=>{

					if(err){
						return res.status(500).json(err);
					}


					// 3. Statistik für diesen Tag neu setzen
					db.run(
						`
						INSERT INTO statistics(
							user_id,
							stat_date,
							steps,
							calories_burned,
							weight_kg
						)

						VALUES(

							?,
							?,

							(
								SELECT IFNULL(SUM(steps),0)
								FROM activities
								WHERE
									user_id = ?
									AND activity_date = ?
									AND completed = 1
							),

							(
								SELECT IFNULL(SUM(calories_burned),0)
								FROM activities
								WHERE
									user_id = ?
									AND activity_date = ?
									AND completed = 1
							),


							(
								SELECT ROUND(
									
									(
										SELECT IFNULL(SUM(calories_burned),0)
										FROM activities
										WHERE
											user_id = ?
											AND completed = 1
									)
									/ 7700.0,

									2
								)
							)

						)

						ON CONFLICT(user_id, stat_date)

						DO UPDATE SET

							steps = excluded.steps,
							calories_burned = excluded.calories_burned,
							weight_kg = excluded.weight_kg

						`,
						[
							activity.user_id,
							activity.activity_date,


							// steps
							activity.user_id,
							activity.activity_date,


							// calories
							activity.user_id,
							activity.activity_date,


							// weight
							activity.user_id
						],
						(err)=>{

							if(err){
								return res.status(500).json(err);
							}


							res.json({
								success:true
							});

						}
					);

				}
			);

		}
	);

});


router.delete("/:id", (req, res) => {

	const id = req.params.id;


	// 1. Activity vorher holen
	db.get(
		`
		SELECT *
		FROM activities
		WHERE id = ?
		`,
		[id],
		(err, activity) => {


			if(err){
				return res.status(500).json(err);
			}


			if(!activity){
				return res.status(404).json({
					error:"Activity not found"
				});
			}


			// 2. Activity löschen
			db.run(
				`
				DELETE FROM activities
				WHERE id = ?
				`,
				[id],
				(err)=>{


					if(err){
						return res.status(500).json(err);
					}


					// 3. Statistik neu berechnen
					db.run(
						`
						INSERT INTO statistics(
							user_id,
							stat_date,
							steps,
							calories_burned,
							weight_kg
						)

						VALUES(

							?,
							?,

							(
								SELECT IFNULL(SUM(steps),0)
								FROM activities
								WHERE
									user_id = ?
									AND activity_date = ?
									AND completed = 1
							),

							(
								SELECT IFNULL(SUM(calories_burned),0)
								FROM activities
								WHERE
									user_id = ?
									AND activity_date = ?
									AND completed = 1
							),


							(
								SELECT ROUND(

									(
										SELECT IFNULL(SUM(calories_burned),0)
										FROM activities
										WHERE
											user_id = ?
											AND completed = 1
									)
									/ 7700.0,

									2
								)
							)

						)

						ON CONFLICT(user_id, stat_date)

						DO UPDATE SET

							steps = excluded.steps,
							calories_burned = excluded.calories_burned,
							weight_kg = excluded.weight_kg

						`,
						[
							activity.user_id,
							activity.activity_date,


							// steps
							activity.user_id,
							activity.activity_date,


							// calories
							activity.user_id,
							activity.activity_date,


							// weight
							activity.user_id
						],
						(err)=>{


							if(err){
								return res.status(500).json(err);
							}


							res.json({
								success:true
							});

						}
					);

				}
			);

		}
	);

});


router.put("/:id", (req, res) => {

	const id = req.params.id;

	const {
		name,
		duration,
		repeat,
		steps,
		calories
	} = req.body;


	// 1. Aktivität ändern
	db.run(
		`
		UPDATE activities
		SET
			title = ?,
			description = ?,
			duration_min = ?,
			steps = ?,
			calories_burned = ?
		WHERE id = ?
		`,
		[
			name,
			repeat,
			duration,
			steps || 0,
			calories || 0,
			id
		],
		(err) => {

			if(err){
				return res.status(500).json(err);
			}


			// 2. Activity wieder holen
			db.get(
				`
				SELECT *
				FROM activities
				WHERE id = ?
				`,
				[id],
				(err, activity) => {


					if(err){
						return res.status(500).json(err);
					}


					// 3. Statistik neu berechnen
					db.run(
						`
						INSERT INTO statistics(
							user_id,
							stat_date,
							steps,
							calories_burned,
							weight_kg
						)

						VALUES(

							?,
							?,

							(
								SELECT IFNULL(SUM(steps),0)
								FROM activities
								WHERE
									user_id = ?
									AND activity_date = ?
									AND completed = 1
							),

							(
								SELECT IFNULL(SUM(calories_burned),0)
								FROM activities
								WHERE
									user_id = ?
									AND activity_date = ?
									AND completed = 1
							),


							(
								SELECT ROUND(
									
									(
										SELECT IFNULL(SUM(calories_burned),0)
										FROM activities
										WHERE
											user_id = ?
											AND completed = 1
									)
									/ 7700.0,

									2
								)
							)

						)

						ON CONFLICT(user_id, stat_date)

						DO UPDATE SET

							steps = excluded.steps,
							calories_burned = excluded.calories_burned,
							weight_kg = excluded.weight_kg

						`,
						[
							activity.user_id,
							activity.activity_date,


							// steps
							activity.user_id,
							activity.activity_date,


							// calories
							activity.user_id,
							activity.activity_date,


							// weight
							activity.user_id
						],
						(err)=>{

							if(err){
								return res.status(500).json(err);
							}


							res.json({
								success:true
							});

						}
					);


				}
			);

		}
	);

});

module.exports = router;