const canvas = document.querySelector('canvas')
const cxt = canvas.getContext('2d')

// const socket = io()

const devicePixelRatio = window.devicePixelRatio
// console.log(devicePixelRatio)
canvas.width = 1024 * devicePixelRatio
canvas.height = 768 * devicePixelRatio

cxt.scale(devicePixelRatio, devicePixelRatio)
p1 = new Player(100,200,150,200,"#eb4034","Keeby")
p1.draw()

const keys = {
    w_pressed : false,
    a_pressed : false,
    s_pressed : false,
    d_pressed : false,
}

setInterval(() => {
    const SPEED = 4
    p1.remove()
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
    p1.draw()
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
    p1.remove()
    p1.draw()
}
             
function render(bullet) {         
    const SPEED = 15
    setTimeout(function() {
        if (bullet.x < canvas.width && bullet.x > 0 && bullet.y < canvas.height && bullet.y > 0) {           
            bullet.draw()
            if (bullet.old_x != null && bullet.old_y != null){
                bullet.remove()
            }
            bullet.old_x = bullet.x
            bullet.old_y = bullet.y
            bullet.x += SPEED*Math.cos(bullet.angle)
            bullet.y -= SPEED*Math.sin(bullet.angle)
            render(bullet)     
        }else{
            bullet.remove()
        }              
    }, 20)
}
var last_shot = 0
function fire(event) {
    if(Date.now() - last_shot > 500){
        last_shot = Date.now()
        bullet = p1.shoot(event.x, event.y)
        render(bullet)
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