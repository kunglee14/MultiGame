const canvas = document.querySelector('canvas')
const body = document.body
const cxt = canvas.getContext('2d')

const socket = io()

canvas.width = innerWidth
canvas.height = innerHeight

const frontendPlayers = {}
const frontendProjectiles = {}

const keys = {
    w_pressed : false,
    a_pressed : false,
    s_pressed : false,
    d_pressed : false,
    mouse_down : false,
    mouse_x : 0,
    mouse_y : 0,
}

setInterval(() => {
    if (keys.w_pressed) {
        socket.emit("keydown",{keycode: "KeyW"})
    }
  
    if (keys.a_pressed) {
        socket.emit("keydown",{keycode: "KeyA"})
    }
  
    if (keys.s_pressed) {
        socket.emit("keydown",{keycode: "KeyS"})
    }
  
    if (keys.d_pressed) {
        socket.emit("keydown",{keycode: "KeyD"})
    }

    if (keys.mouse_down){
        socket.emit("shotFired")
    }

    socket.emit("updateDirection", {mouse_x:keys.mouse_x, mouse_y:keys.mouse_y})
  }, 20)

window.addEventListener('keydown', (event) => {    
    switch (event.code) {
        case 'KeyW':
            keys.w_pressed = true
            break

        case 'KeyA':
            keys.a_pressed = true
            break

        case 'KeyS':
            keys.s_pressed = true
            break

        case 'KeyD':
            keys.d_pressed = true
            break
    }
})
window.addEventListener("mousedown", (event) => {
    keys.mouse_down = true
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w_pressed = false
            break

        case 'KeyA':
            keys.a_pressed = false
            break

        case 'KeyS':
            keys.s_pressed = false
            break

        case 'KeyD':
            keys.d_pressed = false
            break
    }
})
window.addEventListener("mouseup", (event) => {
    keys.mouse_down = false
})

window.addEventListener("mousemove", (event) => {
    keys.mouse_x = event.x
    keys.mouse_y = event.y
})

socket.on("cleanupPlayer", (data)=>{
    const temp = new Player(
        data.player.x,
        data.player.y,
        data.player.clear_radius
    )
    temp.erase()
    delete frontendPlayers[socketId]
})
socket.on("updatePlayers", (backendPlayers) =>{
    for (const socketId in backendPlayers){
        const player_data = backendPlayers[socketId]
        if(frontendPlayers[socketId] == undefined){
            frontendPlayers[socketId] = new Player(
                player_data.x,
                player_data.y,
                player_data.clear_radius,
                player_data.cords,
                player_data.color,
                player_data.username
            )
        }else{
            frontendPlayers[socketId].erase()
            frontendPlayers[socketId].x = player_data.x
            frontendPlayers[socketId].y = player_data.y
            frontendPlayers[socketId].clear_radius = player_data.clear_radius
            frontendPlayers[socketId].cords = player_data.cords
        }
        frontendPlayers[socketId].draw()
    }
})
// socket.on("updateScoreboard", (scoreboard)=>{
//     const sb = document.getElementById("score-board")
//     const sorted = Object.keys(scoreboard)
//     .sort((a, b) => scoreboard[b] - scoreboard[a])
//     .reduce((acc, key) => {
//       acc[key] = scoreboard[key];
//       return acc;
//     }, {});
//     sb.innerHTML = null
//     for(const player_id in sorted){
//         const li = document.createElement("li")
//         li.appendChild(document.createTextNode(`${sorted[player_id].username}: ${sorted[player_id].score}`))
//         sb.appendChild(li)
//     }
// })
// socket.on("removeTrailProjectiles", (backendProjectiles) =>{
//     for(const proj_id in backendProjectiles){
//         const proj = backendProjectiles[proj_id]
//         if(frontendProjectiles[proj_id]){
//         }
//     }
// })
socket.on("updateProjectiles", ({liveBackendProjectiles, deadBackendProjectiles}) =>{
    for(const proj_id in liveBackendProjectiles){
        console.log(`Live: ${proj_id}`)
        const proj = liveBackendProjectiles[proj_id]
        if(frontendProjectiles[proj_id] == undefined){
            frontendProjectiles[proj_id] = new Bullet(proj.x, proj.y, proj.angle, proj.radius)
        } else {
            frontendProjectiles[proj_id].erase()
            frontendProjectiles[proj_id].x = proj.x
            frontendProjectiles[proj_id].y = proj.y
        }
        frontendProjectiles[proj_id].draw()
    }
    
    for(let i = 0; i < deadBackendProjectiles.length; i++){
        const dead_id = deadBackendProjectiles[i]
        frontendProjectiles[dead_id].erase()
        delete frontendPlayers[dead_id]
    }
})
document.querySelector('#usernameForm').addEventListener('submit', (event) => {
    event.preventDefault()
    document.querySelector('#usernameForm').style.display = 'none'
    username = document.querySelector('#usernameInput').value
    document.querySelector("body").removeChild(document.querySelector('#usernameContainer'))
    socket.emit("initGame", {username:username, width:canvas.width, height:canvas.height})
})
window.addEventListener('resize', () => {
    console.log('Window resized!');
    console.log(`Width: ${window.innerWidth}, Height: ${window.innerHeight}`);
    canvas.width = innerWidth
    canvas.height = innerHeight
});