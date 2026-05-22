const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const db = require("../db");


// REGISTER
router.post("/register", async (req, res) => {

    console.log("gefunden")
    try {

        const {
            email,
            username,
            password,
            birthdate,
            height_cm,
            weight_kg
        } = req.body;


        // Passwort hashen
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const sql = `
            INSERT INTO users (
                email,
                username,
                password_hash,
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

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Benutzer erstellt",
                    userId: this.lastID
                });
            }
        );

    } catch(error) {

        res.status(500).json(error);
    }
});

module.exports = router;