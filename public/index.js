const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// const socket = io()

const devicePixelRatio = window.devicePixelRatio
// console.log(devicePixelRatio)
canvas.width = 1024 * devicePixelRatio
canvas.height = 768 * devicePixelRatio

c.scale(devicePixelRatio, devicePixelRatio)
p1 = new Player(100,200,0,"#eb4034","Keeby")
p1.draw(c)

// setInterval(() => {
//     if (keys.w.pressed) {
//       sequenceNumber++
//       playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED })
//       // frontEndPlayers[socket.id].y -= SPEED
//       socket.emit('keydown', { keycode: 'KeyW', sequenceNumber })
//     }
  
//     if (keys.a.pressed) {
//       sequenceNumber++
//       playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 })
//       // frontEndPlayers[socket.id].x -= SPEED
//       socket.emit('keydown', { keycode: 'KeyA', sequenceNumber })
//     }
  
//     if (keys.s.pressed) {
//       sequenceNumber++
//       playerInputs.push({ sequenceNumber, dx: 0, dy: SPEED })
//       // frontEndPlayers[socket.id].y += SPEED
//       socket.emit('keydown', { keycode: 'KeyS', sequenceNumber })
//     }
  
//     if (keys.d.pressed) {
//       sequenceNumber++
//       playerInputs.push({ sequenceNumber, dx: SPEED, dy: 0 })
//       // frontEndPlayers[socket.id].x += SPEED
//       socket.emit('keydown', { keycode: 'KeyD', sequenceNumber })
//     }
//   }, 15)

window.addEventListener('keydown', (event) => {
    SPEED = 5
    // The origin (0,0) is at the top left
    p1.remove(c)
    switch (event.code) {
        case 'KeyW':
            p1.y -= SPEED 
            break

        case 'KeyA':
            p1.x -= SPEED
            break

        case 'KeyS':
            p1.y += SPEED
            break

        case 'KeyD':
            p1.x += SPEED
            break
    }
    p1.draw(c)
})
  
  window.addEventListener('keyup', (event) => {
    // console.log("Key released: " + event.code)
    // switch (event.code) {
    //   case 'KeyW':
    //     keys.w.pressed = false
    //     break
  
    //   case 'KeyA':
    //     keys.a.pressed = false
    //     break
  
    //   case 'KeyS':
    //     keys.s.pressed = false
    //     break
  
    //   case 'KeyD':
    //     keys.d.pressed = false
    //     break
    // }
  })
function updateDirection(event) {
    cursor_offset_y = 20
    cursor_offset_x = 10
    //Origin (0,0) is top left corner
    dy = -(event.y-cursor_offset_y - p1.y) //Flipped since I want + Pi/4 to be top-right of character
    dx = event.x-cursor_offset_x - p1.x
    angle = Math.atan(dy/dx)
    if(dx < 0){
        angle = Math.PI + Math.atan(dy/dx)   
    }
    // if(dx < 0 && dy < 0){
    //     angle = -Math.PI + Math.atan(dy/dx)
    // }
    console.log("Rads: "+ angle + ", Deg: " + (angle * 180 / Math.PI))
    p1.angle = angle
    p1.remove(c)
    p1.draw(c)
}

canvas.addEventListener("mousemove",updateDirection, false)
// document.querySelector('#usernameForm').addEventListener('submit', (event) => {
//     event.preventDefault()
//     document.querySelector('#usernameForm').style.display = 'none'
//     username = document.querySelector('#usernameInput').value
//     p1 = new Player(100,200,50,"#eb4034",username)
//     p1.draw(c)
// })