const canvas = document.querySelector('canvas')
const body = document.body
const cxt = canvas.getContext('2d')

const socket = io()

canvas.width = innerWidth
canvas.height = innerHeight

const frontendPlayers = {}
const frontendProjectiles = []
const scoreboard = new Scoreboard()

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
  }, 10)

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
                player_data.erase_cords,
                player_data.color,
                player_data.username
            )
        }else{
            frontendPlayers[socketId].erase()
            frontendPlayers[socketId].x = player_data.x
            frontendPlayers[socketId].y = player_data.y
            frontendPlayers[socketId].clear_radius = player_data.clear_radius
            frontendPlayers[socketId].cords = player_data.cords
            frontendPlayers[socketId].erase_cords = player_data.erase_cords
        }
        frontendPlayers[socketId].draw()
    }
})
socket.on("updateScoreboard", (scores)=>{
    const score_width = Math.min(300, canvas.width/4)
    const score_height = Math.min(canvas.height - 100, canvas.height / 2)
    const padding = Math.min(canvas.width/10, 50)
    // console.log(`${score_width}, ${score_height}, ${padding}`)
    scoreboard.setLocation(canvas.width-score_width-padding, padding)
    scoreboard.setSize(score_width, score_height)
    console.log(scores)
    scoreboard.setScores(scores)
    scoreboard.draw()
})
socket.on("updateProjectiles", (backendProjectiles) =>{
    for(let i = 0; i < frontendProjectiles.length; i++){
        frontendProjectiles[i].erase()
    }
    //This clears the array without allocating new memory
    frontendProjectiles.length = 0

    for(let i = 0; i < backendProjectiles.length; i++){
        const proj = backendProjectiles[i]
        const new_proj = new Bullet(proj.x, proj.y, proj.angle, proj.radius, proj.color)
        new_proj.draw()
        frontendProjectiles.push(new_proj)
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
    canvas.width = innerWidth
    canvas.height = innerHeight
    socket.emit("resizeScreen", {width:canvas.width, height:canvas.height})
});