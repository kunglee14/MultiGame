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



function updateDirection(event) {
    const frontendPlayer = frontendPlayers[socket.id]
    if(!frontendPlayer) return
    frontendPlayer.mouse_x = event.x
    frontendPlayer.mouse_y = event.y
}
             
// function render(bullet) {         
//     const SPEED = 15
//     setTimeout(function() {
//         if (bullet.x < canvas.width && bullet.x > 0 && bullet.y < canvas.height && bullet.y > 0) {           
//             bullet.draw()
//             if (bullet.old_x != null && bullet.old_y != null){
//                 bullet.remove()
//             }
//             bullet.old_x = bullet.x
//             bullet.old_y = bullet.y
//             bullet.x += SPEED*Math.cos(bullet.angle)
//             bullet.y -= SPEED*Math.sin(bullet.angle)
//             render(bullet)     
//         }else{
//             bullet.remove()
//         }              
//     }, 20)
// }
var last_shot = 0
function fire(event) {
    if(Date.now() - last_shot > 500){
        last_shot = Date.now()
        // bullet = p1.shoot(event.x, event.y)
        // render(bullet)
    }
}

canvas.addEventListener("mousemove", updateDirection, false)
// canvas.addEventListener("mousedown", fire, false)
function getCoords(x,  y, angle, center_to_corner_length) {
    const x_cord = x + (center_to_corner_length * Math.cos(angle))
    const y_cord = y - (center_to_corner_length * Math.sin(angle))
    return [x_cord, y_cord]
}
socket.emit("initGame", {username:"Keeby", width:canvas.width, height:canvas.height})
socket.on("updatePlayers", (backendPlayers) =>{
    for (const socketId in backendPlayers){
        const backendPlayer = backendPlayers[socketId]
        if(!frontendPlayers[socketId]){
            frontendPlayers[socketId] = new Player(
                backendPlayer.x,
                backendPlayer.y,
                backendPlayer.x+50,
                backendPlayer.y,
                backendPlayer.color,
                backendPlayer.username
            )
        }else{
            frontendPlayers[socketId].remove()
            frontendPlayers[socketId].x = backendPlayer.x
            frontendPlayers[socketId].y = backendPlayer.y
        }
        // const frontendPlayer = frontendPlayers[socketId]
        
        frontendPlayers[socketId].draw()
    }
})
// document.querySelector('#usernameForm').addEventListener('submit', (event) => {
//     event.preventDefault()
//     document.querySelector('#usernameForm').style.display = 'none'
//     username = document.querySelector('#usernameInput').value
//     p1 = new Player(100,200,50,"#eb4034",username)
//     p1.draw(c)
// })