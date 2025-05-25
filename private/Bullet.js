const BULLET_RADIUS = 10
const BULLET_SPEED = 20

class Bullet{
    constructor(x, y, angle, playerId){
        this.x = x
        this.y = y
        this.angle = angle
        this.playerId = playerId
        this.radius = BULLET_RADIUS
    }
    
    updateLocation(){
        this.x += BULLET_SPEED * Math.cos(this.angle)
        this.y -= BULLET_SPEED * Math.sin(this.angle)
    }
}
module.exports = {Bullet}