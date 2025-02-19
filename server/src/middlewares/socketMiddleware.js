// This middleware attaches the Socket.IO instance to each incoming request.
export const attachIO = (io) => (req, res, next) => {
  req.io = io;
  next();
};
