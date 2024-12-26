import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
// used to store online users
// {userId:socketId}
const userSocketMap = {};

// io 자체는 서버를 의미하는것이고 그 뒤에 따른 Action을 넣어주어야한다.
io.on("connection", (connectedSocket) => {
  console.log(`A USER CONNECTED ${connectedSocket.id}`);

  const userId = connectedSocket.handshake.query.userId;
  if (userId) userSocketMap[userId] = connectedSocket.id;
  connectedSocket.on("disconnect", () => {
    console.log("SOCKET IS DISCONNECTED FROM SERVER SIDE", connectedSocket.id);
  });
});

export { io, app, server };
