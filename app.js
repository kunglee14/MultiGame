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
const center_to_corner_length = 50
const SPEED = 10

function getPlayerVertCords(x, y, mouse_x, mouse_y){
    //Origin (0,0) is top left corner
    const dy = -(mouse_y - y) //Flipped since I want + Pi/4 to be top-right of character
    const dx = mouse_x - x
    var angle = Math.atan(dy/dx)
    if(dx < 0){
        angle = Math.PI + Math.atan(dy/dx)   
    }

    function getCords(center_x, center_y, length, ang) {
        const x_cord = center_x + (length * Math.cos(ang))
        const y_cord = center_y - (length * Math.sin(ang))
        return [x_cord, y_cord]
    }

    const head_cords = getCords(x, y, center_to_corner_length, angle)
    const left_cords = getCords(x, y, center_to_corner_length, Math.PI * (2/3) + angle)
    const right_cords = getCords(x, y, center_to_corner_length, Math.PI * (4/3) + angle)
    return {head:head_cords, left:left_cords, right:right_cords}
}

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`)
    socket.on('disconnect', (reason) => {
        console.log(`(${socket.id}) disconnected: ${reason}`)
        delete backendPlayers[socket.id]
        // io.emit('updatePlayers', backEndPlayers) //A signal sent to Client
    })
    socket.on('keydown', ({keycode}) => {
        if(!backendPlayers[socket.id]) return
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
        const player = backendPlayers[socket.id]
        backendPlayers[socket.id].cords = getPlayerVertCords(player.x, player.y, player.mouse_x, player.mouse_y)
    })
    socket.on("updateDirection", ({mouse_x, mouse_y}) =>{
        const player = backendPlayers[socket.id]
        if(!player) return
        backendPlayers[socket.id].mouse_x = mouse_x
        backendPlayers[socket.id].mouse_y = mouse_y
        backendPlayers[socket.id].cords = getPlayerVertCords(player.x, player.y, mouse_x, mouse_y) 
    })
    socket.on("initGame", ({username, width, height}) =>{
        const x = width * Math.random()
        const y = height * Math.random()
        const mouse_x = x + 100
        const mouse_y = y
        backendPlayers[socket.id] = {
            username: username,
            x: x,
            y: y,
            mouse_x: mouse_x,
            mouse_y: mouse_y,
            clear_radius: center_to_corner_length,
            color: `hsl(${360 * Math.random()}, 100%, 30%)`,
            cords: getPlayerVertCords(x, y, mouse_x, mouse_y)
        }
    })
})

setInterval(()=>{
    io.emit("updatePlayers", backendPlayers)
},20)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


console.log("Server Loaded")

