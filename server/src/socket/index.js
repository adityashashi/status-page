export const initSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-org", (orgId) => socket.join(orgId));
  });
};
