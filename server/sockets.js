const User = require("./models/user.model");
const Message = require("./models/message.model");

module.exports = (socket) => {
  socket.on("set-username", async (payload) => {
    try {
      await User.findOneAndUpdate(
        {
          name: payload,
        },
        {
          name: payload,
          socket: socket.id,
        },
        {
          upsert: true,
          new: true,
        }
      );
    } catch (err) {
      socket.emit("new-message-lame", err.message);
    }
  });

  socket.on("new-message", async (payload) => {
    try {
      const user = await User.findOne({
        socket: socket.id,
      });

      const receivedMsg = await Message.create({
        text: payload,
        user: user._id,
      });

      await User.findByIdAndUpdate(user._id, {
        $push: { messages: receivedMsg._id },
      });

      const returnedMsg = `[${user.name}]: ${receivedMsg.text}`;

      socket.broadcast.emit("new-message-ok", returnedMsg);
    } catch (err) {
      socket.emit("new-message-lame", err.message);
    }
  });

  socket.on("disconnect", () => {
    User.findOne({ socket: socket.id })
      .then((userDoc) => {
        if (userDoc) {
          console.log(`User ${userDoc._id} disconnected.`);
          const timestamp = new Date().toISOString();
          const message = `[${timestamp}][${userDoc.name}]: Bye bye!`;
          socket.broadcast.emit("new-message-ok", message);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  });
};
