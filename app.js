const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// backend classes
const {Player} = require("./private/Player")
const {Bullet} = require("./private/Bullet")

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
const scoreboard = {}

let canvas_width = null
let canvas_height = null

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`)
    socket.on('disconnect', (reason) => {
        const player = backendPlayers[socket.id] 
        // console.log(player)
        if(player){
            delete backendPlayers[socket.id]
            delete scoreboard[socket.id]
            io.emit('cleanupPlayer', player)
            console.log(`${player.username} disconnected: ${reason}`)
        }
    })
    socket.on('keydown', ({keycode}) => {
        if(!backendPlayers[socket.id]) return
        backendPlayers[socket.id].updateLocation(keycode)
        backendPlayers[socket.id].updatePlayerVertCords()
    })

    var last_shot = 0
    let projectileId = 0
    socket.on("shotFired", ()=>{
        if(!backendPlayers[socket.id]) return
        if(Date.now() - last_shot > 500){
            last_shot = Date.now()
            const player = backendPlayers[socket.id]
            const dy = -(player.mouse_y - player.y)
            const dx = player.mouse_x - player.x
            
            var angle = Math.atan(dy/dx)
            if(dx < 0){
                angle = Math.PI + Math.atan(dy/dx)   
            }
            backendProjectiles[projectileId++] = new Bullet(
                player.cords.head[0],
                player.cords.head[1],
                angle,
                socket.id
            )
        }
    })

    socket.on("updateDirection", ({mouse_x, mouse_y}) =>{
        if(!backendPlayers[socket.id]) return
        backendPlayers[socket.id].updatePlayerVertCords(mouse_x, mouse_y)
    })

    socket.on("initGame", ({username, width, height}) =>{
        const x = width * Math.random()
        const y = height * Math.random()
        canvas_width = width 
        canvas_height = height
        const mouse_x = x
        const mouse_y = y
        
        const player = new Player(
            x, 
            y,
            `hsl(${360 * Math.random()}, 100%, 60%)`, 
            username, 
            width, 
            height
        )

        player.updatePlayerVertCords(mouse_x, mouse_y)
        backendPlayers[socket.id] = player

        scoreboard[socket.id] = {
            score: 0,
            username: username
        }
        io.emit("updateScoreboard",scoreboard)
    })
})

setInterval(()=>{
    io.emit("removeTrailProjectiles", backendProjectiles)

    //Change Do collision checks
    for (const proj_id in backendProjectiles){
        const proj = backendProjectiles[proj_id]
        proj.updateLocation()
        if(proj.x < 0 || proj.x > canvas_width || proj.y < 0 || proj.y > canvas_height){
            delete backendProjectiles[proj_id]
        }
        
        for(const player_id in backendPlayers){
            const player = backendPlayers[player_id]
            const dist = Math.hypot(proj.x-player.x, proj.y-player.y)
            if(dist <= (player.clear_radius + proj.size)){
                delete backendProjectiles[proj_id]
                scoreboard[proj.playerId].score++
                io.emit("updateScoreboard", scoreboard)
                break
            }
        }
    }

    io.emit("updateProjectiles", backendProjectiles)
    io.emit("updatePlayers", backendPlayers)
},20)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


console.log("Server Loaded")

