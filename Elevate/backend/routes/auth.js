const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const db = require("../db");


/* ------------------- */
/* REGISTER */
/* ------------------- */

router.post("/register", async (req, res) => {

    try {

        const {
            email,
            username,
            password,
            birthdate,
            height_cm,
            weight_kg
        } = req.body;

        /* Zahlen umwandeln */

        const parsedHeight = Number(height_cm);
        const parsedWeight = Number(weight_kg);

        /* Passwort hashen */

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        /* SQL */

        const sql = `
            INSERT INTO users (
                email,
                username,
                password,
                birthdate,
                height_cm,
                weight_kg
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                email,
                username,
                hashedPassword,
                birthdate,
                parsedHeight,
                parsedWeight
            ],
            function(err) {

                if(err) {

                    console.log(err);

                    return res.status(500).json(err);

                }

                res.json({
                    success: true,
                    message: "Benutzer erstellt",
                    userId: this.lastID
                });

            }
        );

    } catch(error) {

        console.log(error);

        res.status(500).json(error);

    }

});

module.exports = router;