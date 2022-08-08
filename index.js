const app = require("express")()
const http = require("http")
const cors = require("cors")
const server = http.createServer(app);
const { Server } = require("socket.io")


//from socket io v3, should add cors
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let activeUsers = [];
const addUser = (userId, socketId) => {
  !activeUsers.some(user => user.id === userId) &&
  activeUsers.push({userId, socketId})
}

const removeUser = (socketId) => {
  activeUsers = activeUsers.filter(user => user.socketId !== socketId)
}

// io.on("connection", (socket) => {
//   // add new User
//   socket.on("new-user-add", (newUserId) => {
//     // if user is not added previously
//     if (!activeUsers.some((user) => user.userId === newUserId)) {
//       activeUsers.push({ userId: newUserId, socketId: socket.id });
//       console.log("New User Connected", activeUsers);
//     }
//     // send all active users to new user
//     io.emit("get-users", activeUsers);
//   });

//   socket.on("disconnect", () => {
//     // remove user from active users
//     activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
//     console.log("User Disconnected", activeUsers);
//     // send all active users to all users 
//     io.emit("get-users", activeUsers);
//   });

//   // send message to a specific user
//   socket.on("send-message", (data) => {
//     const { receiverId } = data;
//     const user = activeUsers.find((user) => user.userId === receiverId);
//     console.log("Sending from socket to :", receiverId)
//     console.log("Data: ", data)
//     if (user) {
//       console.log(user)
//       io.emit("recieve-message", data);
//     }
//   });
// });

io.on('connect', (socket)=> {
  console.log("A user conncted!")

  socket.on('addUser', (userId) => {
    console.log(`${userId} is online`)

    addUser(userId, socket.id)
    io.emit('getUsers', activeUsers)
  })

  socket.on('sendMessage', ({senderId, receiverId, message}) => {
    //find the receiver
    const receiver = activeUsers.find(user => user.userId === receiverId)
    console.log("receiver: ", receiver, message)
    activeUsers.length > 0 && io.to(receiver.socketId).emit('getMessage', {
      senderId,
      message
    })
  })

  socket.on("disconnect", () => {
    // remove user from active users
    removeUser(socket.id)
    console.log("User Disconnected");
    // send all active users to all users 
    io.emit("getUsers", activeUsers);
  });
})

server.listen(8080, () => {
  console.log('listening on *:8000');
});