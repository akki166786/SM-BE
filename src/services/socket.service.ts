import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import { verifyToken } from "../utils/auth.js";
import { messagesService } from "./messages.service.js";

const userSockets = new Map<string, string>();

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const payload = verifyToken(token);

    if (!payload) {
      return next(new Error("Authentication error"));
    }

    (socket as any).userId = payload.userId;
    (socket as any).username = payload.username;
    next();
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
    const username = (socket as any).username;

    userSockets.set(userId, socket.id);

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on(
      "send_message",
      async (
        data: {
          conversation_id: string;
          content: string;
          type?: string;
        },
        callback
      ) => {
        try {
          const message = await messagesService.sendMessage(userId, {
            conversation_id: data.conversation_id,
            content: data.content,
            type: (data.type || "text") as any,
          });

          io.to(`conversation:${data.conversation_id}`).emit("new_message", {
            id: message.id,
            conversation_id: message.conversation_id,
            sender_id: message.sender_id,
            senderName: message.sender.username,
            content: message.content,
            type: message.type,
            created_at: message.created_at,
            is_read: message.is_read,
          });

          if (callback) {
            callback({ success: true, message });
          }
        } catch (error) {
          if (callback) {
            callback({
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to send message",
            });
          }
        }
      }
    );

    socket.on("typing", (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        userId,
        username,
      });
    });

    socket.on("stop_typing", (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit("user_stop_typing", {
        userId,
      });
    });

    socket.on("disconnect", () => {
      userSockets.delete(userId);
    });
  });

  return io;
}

export function getUserSocket(userId: string): string | undefined {
  return userSockets.get(userId);
}
