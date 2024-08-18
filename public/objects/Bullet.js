class Bullet{
    constructor(x, y, angle){
        this.x = x
        this.y = y
        this.angle = angle
        this.old_x = null
        this.old_y = null
    }
    
    draw(){
        const SIZE = 5
        cxt.shadowBlur = 5
        cxt.beginPath()
        cxt.arc(this.x, this.y, SIZE, 0, Math.PI * 2)
        cxt.fillStyle = "white"
        cxt.fill()
    }
    remove(){
        const SIZE = 5
        cxt.shadowBlur = 0
        cxt.beginPath()
        cxt.arc(this.old_x, this.old_y, SIZE+5, 0, Math.PI * 2)
        cxt.fillStyle = "black"
        cxt.fill()
    }
}