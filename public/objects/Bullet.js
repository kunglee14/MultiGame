class Bullet{
    constructor(x, y, angle, size){
        this.x = x
        this.y = y
        this.angle = angle
        this.size = size
    }
    
    draw(){
        cxt.shadowBlur = 5
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        cxt.fillStyle = "white"
        cxt.fill()
    }
    remove(){
        cxt.shadowColor = window.getComputedStyle(canvas).backgroundColor
        cxt.shadowBlur = 5
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.size+5, 0, Math.PI * 2)
        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        cxt.fill()
    }
}