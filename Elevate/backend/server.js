const express = require("express");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const activityRoutes = require('./routes/activities');
const chatRoutes = require('./routes/messages');
const statisticsRoutes = require("./routes/statistics");

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use('/tasks', activityRoutes);
app.use('/chat', chatRoutes);
app.use("/statistics", statisticsRoutes);

app.get("/", (req, res) => {
    res.send("Backend läuft");
});

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173"
	}
});

io.on("connection", (socket) => {

	console.log("User verbunden");

	// User Raum beitreten
	socket.on("join", (userId) => {

		socket.join(userId.toString());

		console.log("User joined:", userId);

	});

	// Nachricht senden
	socket.on("send_message", (message) => {

		console.log(message);

		io.to(message.receiver_id.toString()).emit(
			"receive_message",
			message
		);

	});

	socket.on("disconnect", () => {

		console.log("User getrennt");

	});

});

server.listen(3000, () => {
	console.log("Server läuft auf Port 3000");
});