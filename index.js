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

let users = []

app.use("/", (req, res) => {
  res.send("Welcome!")
})

//run when a client connects
io.on('connection', (socket) => {
  
  
  socket.on('join', ({username, room}) => {
    console.log(username, room)
    const user = {
      username,
      id: socket.id,
      room
    }
    users.push(user)
    socket.join(room)
  })

   //listen to if a client send a message to server
  socket.on("chatting-message", (msg)=> {
    const user = users.find(user => user.username === msg.username)
    io.to(user.room).emit("chatting-message", msg)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

 
});

server.listen(8080, () => {
  console.log('listening on *:8000');
});
