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

app.use("/", (req, res) => {
  res.send("Welcome!")
})

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("chatting-message", (msg)=> {
    io.emit("chatting-message", msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(8080, () => {
  console.log('listening on *:8000');
});
