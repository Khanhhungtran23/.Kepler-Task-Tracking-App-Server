import { Server, Socket } from "socket.io";
import Notice from "../models/notification.model"; // Import model Notification
import mongoose from "mongoose";

interface MarkAsReadPayload {
  notificationId: string;
  userId: string;
}

// Hàm để thiết lập WebSocket
export function setupWebSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on(
      "markAsRead",
      async ({ notificationId, userId }: MarkAsReadPayload) => {
        try {
          // Tìm thông báo và kiểm tra xem người dùng đã đọc chưa ???
          const notification = await Notice.findById(notificationId);
          if (!notification) {
            return; // Nếu thông báo không tồn tại - exit
          }

          // Nếu userId chưa có trong mảng isRead, thêm vào
          if (
            !notification.isRead.includes(new mongoose.Types.ObjectId(userId))
          ) {
            notification.isRead.push(new mongoose.Types.ObjectId(userId));
            await notification.save(); // Lưu thay đổi vào cơ sở dữ liệu
          }

          // Phát sự kiện đến front-end để cập nhật trạng thái đọc
          socket.emit("notificationRead", { notificationId, userId });
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      },
    );
  });
}
