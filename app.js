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
const io = new Server(server, { pingInterval: 20, pingTimeout: 500 })

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
}); 

const backendPlayers = {}
const backendProjectiles = []
const scoreboard = {}
let sorted_scores = []

let canvas_width = null
let canvas_height = null

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`)
    socket.on('disconnect', (reason) => {
        const player = backendPlayers[socket.id] 

        if(player != undefined){
            delete backendPlayers[socket.id]
            delete scoreboard[socket.id]
            io.emit('cleanupPlayer', {player:player, socketId:socket.id})
            console.log(`${player.username} disconnected: ${reason}`)
        }
    })
    socket.on('keydown', ({keycode}) => {
        if(backendPlayers[socket.id] == undefined) return
        backendPlayers[socket.id].updateLocation(keycode)
        backendPlayers[socket.id].updatePlayerVertCords(null, null, canvas_width, canvas_height)
    })

    socket.on("shotFired", ()=>{
        if(backendPlayers[socket.id] == undefined) return
        
        const player = backendPlayers[socket.id]
        if(player.intervals_since_last_shot >= 50){
            player.intervals_since_last_shot = 0
            const dy = -(player.mouse_y - player.y)
            const dx = player.mouse_x - player.x
            
            var angle = Math.atan(dy/dx)
            if(dx < 0){
                angle += Math.PI   
            }
            backendProjectiles.push(new Bullet(
                player.cords.head[0],
                player.cords.head[1],
                angle,
                socket.id,
                player.color
            ))
        }
    })

    socket.on("updateDirection", ({mouse_x, mouse_y}) =>{
        if(backendPlayers[socket.id] == undefined) return
        backendPlayers[socket.id].updatePlayerVertCords(mouse_x, mouse_y, canvas_width, canvas_height)
    })

    socket.on("initGame", ({username, width, height}) =>{
        const x = Math.round(width * Math.random())
        const y = Math.round(height * Math.random())
        canvas_width = width 
        canvas_height = height
        const mouse_x = x
        const mouse_y = y
        
        const player_color = `hsl(${360 * Math.random()}, 100%, 60%)`
        const player = new Player(
            x, 
            y,
            player_color, 
            username
        )

        player.updatePlayerVertCords(mouse_x, mouse_y)
        backendPlayers[socket.id] = player

        scoreboard[socket.id] = {
            score: 0,
            username: username,
            color: player_color
        }
    })
    socket.on('resizeScreen', ({width, height}) => {
        canvas_width = width 
        canvas_height = height
    })
})

setInterval(()=>{
    //Change Do collision checks
    for (let i = 0; i < backendProjectiles.length; i++){
        const proj = backendProjectiles[i]
        proj.updateLocation()
        if(proj.x < 0 || proj.x > canvas_width || proj.y < 0 || proj.y > canvas_height){
            backendProjectiles.splice(i,1) //Remove 1 element at index i
        }
        
        for(const player_id in backendPlayers){
            if(player_id == proj.playerId){
                continue
            }
            const player = backendPlayers[player_id]
            const dist = Math.hypot(proj.x-player.x, proj.y-player.y)
            if(dist <= (player.clear_radius + proj.radius)){
                backendProjectiles.splice(i,1) //Remove 1 element at index i
                scoreboard[proj.playerId].score++

                sorted_scores = Object.values(scoreboard).sort((a, b) => b.score - a.score);
                // console.log(sorted_scores)
                break
            }
        }
    }
    for(const player_id in backendPlayers){
        backendPlayers[player_id].intervals_since_last_shot += 1
    }
    io.emit("updateProjectiles", backendProjectiles)
    io.emit("updatePlayers", backendPlayers)
    io.emit("updateScoreboard", sorted_scores.slice(0,10))
},10)

server.listen(port,() => {
    console.log(`Server running at http://localhost:${port}/`);
});


console.log("Server Loaded")

