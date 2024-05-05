import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;
const app = express();
const server = new createServer(app);
const frontendOrigin = ["http://localhost:5173"];
const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Heloo world");
});

const user = true;
io.use((socket, next) => {
  if (user) next();
});
io.on("connection", (socket) => {
  console.log("userconnected", socket.id);
  socket.on("message", ({ room, message }) => {
    socket.to(room).emit("receive-message", message);
  });
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("user Joined room", room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
