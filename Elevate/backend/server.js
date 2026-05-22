const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend läuft");
});

app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});


