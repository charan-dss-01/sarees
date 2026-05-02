import { Server as SocketServer } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { logger } from "../lib/logger.js";

let io: SocketServer | null = null;

export function initSocket(server: HttpServer): SocketServer {
  io = new SocketServer(server, {
    path: "/api/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket client connected");

    socket.on("join", (room: string) => {
      socket.join(room);
      logger.info({ socketId: socket.id, room }, "Socket joined room");
    });

    socket.on("disconnect", (reason) => {
      logger.info({ socketId: socket.id, reason }, "Socket client disconnected");
    });
  });

  logger.info("Socket.io initialized at /api/socket.io");
  return io;
}

export function getIo(): SocketServer {
  if (!io) throw new Error("Socket.io has not been initialized. Call initSocket() first.");
  return io;
}
