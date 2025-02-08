const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let userLocations = {}; // Object to store user locations

io.on("connection", function (socket) {
    console.log("User connected:", socket.id);

    // When a user sends location data, update their position
    socket.on("send-location", function (data) {
        userLocations[socket.id] = data; // Store the location
        io.emit("receive-location", { id: socket.id, ...data }); // Send location to all clients
    });

    // Handle user disconnect and remove their location
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id); // Notify all clients that the user has disconnected
        delete userLocations[socket.id]; // Remove user from the location list
        console.log("User disconnected:", socket.id);
    });
});

app.get("/", function (req, res) {
    res.render("index");
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});
