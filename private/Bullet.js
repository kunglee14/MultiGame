const BULLET_SIZE = 10
const BULLET_SPEED = 20

class Bullet{
    constructor(x, y, angle, playerId){
        this.x = x
        this.y = y
        this.angle = angle
        this.playerId = playerId
        this.size = BULLET_SIZE
    }
    
    updateLocation(){
        this.x += BULLET_SIZE * Math.cos(this.angle)
        this.y -= BULLET_SPEED * Math.sin(this.angle)
    }
}
module.exports = {Bullet}