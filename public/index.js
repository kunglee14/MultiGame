const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// const socket = io()

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = 1024 * devicePixelRatio
canvas.height = 576 * devicePixelRatio

c.scale(devicePixelRatio, devicePixelRatio)


//Draw players
p1 = new Player(100,200,50,"#eb4034","Keeby")
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
    SPEED = 20
    // The origin (0,0) is at the top left
    p1.draw(c,"black")
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