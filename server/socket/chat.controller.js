import  message  from "../src/models/message.model.js";
import users from "../src/models/user.model.js";

class ChatController {
  constructor(io) {
    this.io = io;
    this.activeUsers = new Map(); 
  }

  initialize(socket) {
    console.log('User connected:', socket.id);  
  }
}

export default ChatController;

