const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

const backendPlayers = {}

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`)
    socket.on('disconnect', (reason) => {
        console.log(`(${socket.id}) disconnected: ${reason}`)
        delete backendPlayers[socket.id]
        // io.emit('updatePlayers', backEndPlayers) //A signal sent to Client
    })
    socket.on('keydown', ({keycode}) => {
        const SPEED = 10
        switch(keycode){
            case 'KeyW':
                backendPlayers[socket.id].y -= SPEED
                break
            case 'KeyA':
                backendPlayers[socket.id].x -= SPEED
                break

            case 'KeyS':
                backendPlayers[socket.id].y += SPEED
                break

            case 'KeyD':
                backendPlayers[socket.id].x += SPEED
                break
        }
    })

    socket.on("initGame", ({username, width, height}) =>{
        backendPlayers[socket.id] = {
            x: width * Math.random(),
            y: height * Math.random(),
            color: `hsl(${360 * Math.random()}, 100%, 30%)`,
            username: username
        }
        io.emit("updatePlayers", backendPlayers)
    })
})

setInterval(()=>{
    io.emit("updatePlayers", backendPlayers)
},20)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


console.log("Server Loaded")

