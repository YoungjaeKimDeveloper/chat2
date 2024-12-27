import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
// SOCKET.IO SERVER

// ==========
// ==========
// SOCKET만 따로 잘라서
var userSocketMap = {}; // {userId:socketId}
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
// Socket.io Server
// Server위에 socket얹어주기만하면됌
// Socket 은 다른 파일에 따로 관리해애줘야하마
io.on("connection", (clientSocket) => {
  console.log(`CLIENT HAS CONNECTED ${clientSocket.id}`);
  const userID = clientSocket.handshake.query.userId;
  console.log("USERID: ", userID);
  if (userID) {
    userSocketMap[userID] = clientSocket.id;
  }
  // io.emit() is used to send events to all the connected clients
  //모든 클라이언트에게 보낼때 사용됨
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // clientSocket.emit() 특정 클라이언트에게 emit해줄떄만 사용하게됨
  clientSocket.on("disconnect", () => {
    console.info("A CLIENT SOCKET HAS BEEN DISCONNECTED", clientSocket.id);
    delete userSocketMap[userID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
