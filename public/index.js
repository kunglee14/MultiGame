const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// const socket = io()

const devicePixelRatio = window.devicePixelRatio
// console.log(devicePixelRatio)
canvas.width = 1024 * devicePixelRatio
canvas.height = 768 * devicePixelRatio

c.scale(devicePixelRatio, devicePixelRatio)
p1 = new Player(100,200,150,200,"#eb4034","Keeby")
p1.draw(c)

const keys = {
    w_pressed : false,
    a_pressed : false,
    s_pressed : false,
    d_pressed : false,
}

setInterval(() => {
    const SPEED = 4
    p1.remove(c)
    if (keys.w_pressed) {
      p1.y += -SPEED
    }
  
    if (keys.a_pressed) {
      p1.x += -SPEED
    }
  
    if (keys.s_pressed) {
        p1.y += SPEED
    }
  
    if (keys.d_pressed) {
        p1.x += SPEED
    }
    p1.draw(c)
  }, 15)

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
    p1.mouse_x = event.x
    p1.mouse_y = event.y
    p1.remove(c)
    p1.draw(c)
}

var last_shot = 0
function fire(event) {
    if(Date.now() - last_shot > 50){
        last_shot = Date.now()
        p1.shoot(event.x, event.y)
    }
}

canvas.addEventListener("mousemove", updateDirection, false)
canvas.addEventListener("mousedown", fire, false)
// document.querySelector('#usernameForm').addEventListener('submit', (event) => {
//     event.preventDefault()
//     document.querySelector('#usernameForm').style.display = 'none'
//     username = document.querySelector('#usernameInput').value
//     p1 = new Player(100,200,50,"#eb4034",username)
//     p1.draw(c)
// })