import message from "../src/models/message.model.js";
import asyncHandler from "../src/utils/asyncHandler.js";
import ApiError from "../src/utils/apiError.js";
import ApiResponse from "../src/utils/apiResponse.js";

class ChatController {
  constructor(io) {
    this.io = io;
    this.activeUsers = new Map();
  }

  handleNewMessage = asyncHandler(async (socket, data) => {
    const { channelId, registration_number, messages } = data;

    if (!channelId || !registration_number || !messages?.trim()) {
      throw new ApiError("All fields are required", 400);
    }

    const newMessage = await message.create({
      channelId,
      registration_number,
      messages,
    });

    const messageWithUser = await message.findOne({
      where: { id: newMessage.id },
      include: ["user"],
    });

    if (!messageWithUser) {
      throw new ApiError("Message creation failed", 500);
    }

    const response = new ApiResponse(
      201,
      {
        id: messageWithUser.id,
        channelId: messageWithUser.channelId,
        registration_number: messageWithUser.registration_number,
        messages: messageWithUser.messages,
        user: messageWithUser.user,
        createdAt: messageWithUser.createdAt,
      },
      "Message sent successfully"
    );

    this.io.to(channelId.toString()).emit("newMessage", response);
    socket.emit("messageSent", response);
  });

  handleJoinRoom = (socket, channelId) => {
    socket.join(channelId.toString());
    console.log(`User joined room: ${channelId}`);
  };

  handleUserConnect = (socket, userData) => {
    this.activeUsers.set(socket.id, userData);
    this.io.emit("updateActiveUsers", Array.from(this.activeUsers.values()));
    console.log("New user connected:", socket.id);
  };

  handleDisconnect = (socket) => {
    socket.on("disconnect", () => {
      this.activeUsers.delete(socket.id);
      this.io.emit("updateActiveUsers", Array.from(this.activeUsers.values()));
      console.log("User disconnected:", socket.id);
    });
  };

  init(socket) {
    socket.on("sendMessage", async (data) => {
      try {
        await this.handleNewMessage(socket, data);
      } catch (error) {
        socket.emit("messageError", {
          message: error.message,
          statusCode: error.statusCode || 500,
        });
      }
    });

    socket.on("joinRoom", (channelId) =>
      this.handleJoinRoom(socket, channelId)
    );
    socket.on("userConnect", (userData) =>
      this.handleUserConnect(socket, userData)
    );
    this.handleDisconnect(socket);
  }
}

export default ChatController;
