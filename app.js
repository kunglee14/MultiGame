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
const backendProjectiles = {}
const center_to_corner_length = 50
const SPEED = 10

function updatePlayerVertCords(socketId, x = null, y = null, mouse_x = null, mouse_y = null){
    if(x != null) backendPlayers[socketId].x = x
    if(y != null)  backendPlayers[socketId].y = y
    if(mouse_x != null) backendPlayers[socketId].mouse_x = mouse_x
    if(mouse_y != null) backendPlayers[socketId].mouse_y = mouse_y
    const player = backendPlayers[socketId]
    
    //Origin (0,0) is top left corner
    const dy = -(player.mouse_y - player.y) //Flipped since I want + Pi/4 to be top-right of character
    const dx = player.mouse_x - player.x
    var angle = Math.atan(dy/dx)
    if(dx < 0){
        angle = Math.PI + Math.atan(dy/dx)   
    }

    function getCords(ang) {
        const x_cord = player.x + (center_to_corner_length * Math.cos(ang))
        const y_cord = player.y - (center_to_corner_length * Math.sin(ang))
        return [x_cord, y_cord]
    }

    const head_cords = getCords(angle)
    const left_cords = getCords(Math.PI * (2/3) + angle)
    const right_cords = getCords(Math.PI * (4/3) + angle)
    backendPlayers[socketId].cords = {head:head_cords, left:left_cords, right:right_cords}
}

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`)
    socket.on('disconnect', (reason) => {
        const player = backendPlayers[socket.id] 
        // console.log(player)
        if(player){
            delete backendPlayers[socket.id]
            io.emit('cleanupPlayer', player)
            console.log(`${player.username} disconnected: ${reason}`)
        }
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
        updatePlayerVertCords(socket.id)
    })
    var last_shot = 0
    let projectileId = 0
    socket.on("shotFired", ()=>{
        if(Date.now() - last_shot > 500){
            last_shot = Date.now()
            const player = backendPlayers[socket.id]
            const dy = -(player.mouse_y - player.y)
            const dx = player.mouse_x - player.x
            const BULLET_SPEED = 15
            var angle = Math.atan(dy/dx)
            if(dx < 0){
                angle = Math.PI + Math.atan(dy/dx)   
            }
            backendProjectiles[projectileId++] = {
                x: player.cords.head[0],
                y: player.cords.head[1],
                angle: angle,
                vel: BULLET_SPEED,
                radius: 10,
            }   
        }
    })
    socket.on("updateDirection", ({mouse_x, mouse_y}) =>{
        if(!backendPlayers[socket.id]) return
        updatePlayerVertCords(socket.id, null, null, mouse_x, mouse_y) 
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
        }
        updatePlayerVertCords(socket.id)
    })
})

setInterval(()=>{
    io.emit("removeOldProjectiles", backendProjectiles)

    //Change Do collision checks
    for (const proj_id in backendProjectiles){
        const proj = backendProjectiles[proj_id]
        backendProjectiles[proj_id].x += proj.vel * Math.cos(proj.angle)
        backendProjectiles[proj_id].y -= proj.vel * Math.sin(proj.angle)
    }
    io.emit("updateProjectiles", backendProjectiles)
    io.emit("updatePlayers", backendPlayers)
},20)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


console.log("Server Loaded")

