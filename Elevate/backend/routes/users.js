const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../db");

//Test
router.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE username = ?
        `;

        db.get(sql, [username], async (err, user) => {
            if(err){
                return res.status(500).json(err);
            }

            if(!user){
                return res.status(401).json({
                    message: "Benutzer bicht gefunden"
                });
            }
        })

        const validPassword = bcrypt.compare(
            password,
            user.password_hash
        );

        if(!validPassword){
            return res.status(401).json({
                message: "Falsches Passwort"
            });
        }

        res.json({
            message: "Login erfolgreich",

            user:{
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
});

router.get("/search/:username", (req, res) => {

	const username = req.params.username;

	const sql = `
		SELECT id, username
		FROM users
		WHERE username LIKE ?
		LIMIT 10
	`;

	db.all(sql, [`%${username}%`], (err, rows) => {

		if(err) {
			return res.status(500).json(err);
		}

		res.json(rows);

	});

});



module.exports = router;