class ChatController {
  constructor(io) {
    this.io = io;
    this.activeUsers = new Map(); 
  }

  initialize(socket) {
    console.log('User connected:', socket.id);  
    this.handleJoinChannel(socket);
    this.handleSendMessage(socket);
    this.handleDisconnect(socket);
  }
}

 handleJoinChannel(socket) {
    socket.on('joinChannel', (channelId) => {
      socket.join(channelId.toString());
      console.log(`User joined channel: ${channelId}`);
    });
  }



export default ChatController;

