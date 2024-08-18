const canvas = document.querySelector('canvas')
const body = document.body
const cxt = canvas.getContext('2d')

const socket = io()

const devicePixelRatio = window.devicePixelRatio
console.log(devicePixelRatio)
canvas.width = 1024 * devicePixelRatio
canvas.height = 768 * devicePixelRatio
// console.log(window.getComputedStyle(body).width, window.getComputedStyle(body).height)
// w = parseFloat(window.getComputedStyle(body).width)
// h = parseFloat(window.getComputedStyle(body).width)
// canvas.width = w
// canvas.height = h
cxt.scale(devicePixelRatio, devicePixelRatio)

const frontendPlayers = {}

const keys = {
    w_pressed : false,
    a_pressed : false,
    s_pressed : false,
    d_pressed : false,
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

canvas.addEventListener("mousemove", (event) => (socket.emit("updateDirection", {mouse_x:event.x, mouse_y:event.y})), false)
canvas.addEventListener("mousedown", (event) => (socket.emit("shotFired")), false)
socket.on("cleanupPlayer", (player)=>{
    const temp = new Player(
        player.x,
        player.y,
        player.clear_radius
    )
    temp.remove()
})
socket.on("updatePlayers", (backendPlayers) =>{
    for (const socketId in backendPlayers){
        const player_data = backendPlayers[socketId]
        if(!frontendPlayers[socketId]){
            frontendPlayers[socketId] = new Player(
                player_data.x,
                player_data.y,
                player_data.clear_radius,
                player_data.cords,
                player_data.color,
                player_data.username
            )
        }else{
            frontendPlayers[socketId].remove()
            frontendPlayers[socketId].x = player_data.x
            frontendPlayers[socketId].y = player_data.y
            frontendPlayers[socketId].clear_radius = player_data.clear_radius
            frontendPlayers[socketId].cords = player_data.cords
        }
        frontendPlayers[socketId].draw()
    }
})
socket.on("removeOldProjectiles", (backendProjectiles) =>{
    for(const proj_id in backendProjectiles){
        const proj = backendProjectiles[proj_id]
        cxt.shadowColor = window.getComputedStyle(canvas).backgroundColor
        cxt.shadowBlur = 5
        cxt.beginPath()
        cxt.arc(proj.x, proj.y, proj.radius+5, 0, Math.PI * 2)
        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        cxt.fill()
    }
})
socket.on("updateProjectiles", (backendProjectiles) =>{
    for(const proj_id in backendProjectiles){
        const proj = backendProjectiles[proj_id]
        cxt.shadowBlur = 5
        cxt.beginPath()
        cxt.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2)
        cxt.fillStyle = "white"
        cxt.fill()
    }
})
socket.emit("initGame", {username:"Keeby", width:canvas.width, height:canvas.height})
// document.querySelector('#usernameForm').addEventListener('submit', (event) => {
//     event.preventDefault()
//     document.querySelector('#usernameForm').style.display = 'none'
//     username = document.querySelector('#usernameInput').value
//     p1 = new Player(100,200,50,"#eb4034",username)
//     p1.draw(c)
// })