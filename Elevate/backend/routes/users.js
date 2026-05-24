const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../db");



router.get("/search/:username", (req, res) => {

	const username = req.params.username;

	const sql = `
		SELECT
        users.id,
        users.username,

        EXISTS(
            SELECT 1
            FROM friend_requests
            WHERE
                sender_id = ?
                AND receiver_id = users.id
        ) as requested,

        EXISTS(
            SELECT 1
            FROM friends
            WHERE
                user_id = ?
                AND friend_id = users.id
        ) as is_friend

    FROM users

    WHERE username LIKE ?

    LIMIT 10
	`;

	const currentUserId = req.query.userId;

    db.all(
	sql,
        [
            currentUserId,
            currentUserId,
            `%${username}%`
        ], (err, rows) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(rows);

	});

});

router.post("/request", (req, res) => {

	const {
		sender_id,
		receiver_id
	} = req.body;

	const sql = `
		INSERT INTO friend_requests (
			sender_id,
			receiver_id
		)
		VALUES (?, ?)
	`;

	db.run(
		sql,
		[
			sender_id,
			receiver_id
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

router.get("/requests/:id", (req, res) => {

	const id = req.params.id;

	const sql = `
		SELECT
			friend_requests.id,
			users.username,
			users.id as user_id
		FROM friend_requests
		JOIN users
			ON users.id = friend_requests.sender_id
		WHERE
			friend_requests.receiver_id = ?
			AND friend_requests.status = 'pending'
	`;

	db.all(sql, [id], (err, rows) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(rows);

	});

});


router.post("/accept", (req, res) => {

	const {
		request_id,
		user_id,
		friend_id
	} = req.body;

	const updateSql = `
		UPDATE friend_requests
		SET status = 'accepted'
		WHERE id = ?
	`;

	db.run(updateSql, [request_id], function(err) {

		if(err) {
			return res.status(500).json(err);
		}

		const friendSql = `
			INSERT INTO friends (
				user_id,
				friend_id
			)
			VALUES (?, ?)
		`;

		db.run(friendSql, [user_id, friend_id]);

		db.run(friendSql, [friend_id, user_id]);

		res.json({
			success: true
		});

	});

});

router.get("/friends/:id", (req, res) => {

	const id = req.params.id;

	const sql = `
		SELECT
			users.id,
			users.username
		FROM friends
		JOIN users
			ON users.id = friends.friend_id
		WHERE friends.user_id = ?
	`;

	db.all(sql, [id], (err, rows) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(rows);

	});

});

module.exports = router;