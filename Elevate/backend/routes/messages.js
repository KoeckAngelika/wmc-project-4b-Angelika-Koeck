const express = require("express");
const router = express.Router();

const db = require("../db");
const { send } = require("vite");

router.post("/save-message", (req, res) => {

	const {
		sender_id,
		receiver_id,
		message
	} = req.body;

    const sql = `
    INSERT INTO messages
    (sender_id, receiver_id, message)
    VALUES (?,?,?)`;

    db.run(sql, [sender_id, receiver_id, message], function(err) {

		if(err) {
			return res.status(500).json(err);n 
		}

		res.json({
			success: true,
			messageId: this.lastID
		});

	});

});

router.get("/load-messages/:senderId/:receiverId", (req, res) => {

	const senderId = req.params.senderId;
	const receiverId = req.params.receiverId;

	const sql = `
		SELECT *
		FROM messages
		WHERE
			(sender_id = ? AND receiver_id = ?)
			OR
			(sender_id = ? AND receiver_id = ?)
		ORDER BY created_at ASC
	`;

	db.all(
		sql,
		[senderId, receiverId, receiverId, senderId],
		(err, rows) => {

			if(err) {
				return res.status(500).json(err);
			}

			res.json(rows);

		}
	);

});

module.exports = router;