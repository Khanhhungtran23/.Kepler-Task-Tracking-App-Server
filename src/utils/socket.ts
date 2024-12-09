import { Server, Socket } from "socket.io";
import { Notice, Room } from "../models/notification.model";

export const setupWebSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("new_message", async (message) => {
      console.log("Received new message:", message);

      socket.broadcast.emit("new_message", message);

      // save noti into database Notification:
      try {
        const notice = new Notice({
          team: [],
          text: `New message from ${message.username}: ${message.text}`,
          sender: message.username,
          notiType: "message",
          room: message.roomId,
        });
        await notice.save();
        console.log("Notification saved to database:", notice);
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    });

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
