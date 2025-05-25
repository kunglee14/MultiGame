class Bullet{
    constructor(x, y, angle, radius){
        this.x = x
        this.y = y
        this.angle = angle
        this.radius = radius
    }
    
    draw(){
        cxt.shadowBlur = 5
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        cxt.fillStyle = "white"
        cxt.fill()
    }
    erase(){
        cxt.shadowColor = window.getComputedStyle(canvas).backgroundColor
        cxt.shadowBlur = 5
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.radius+5, 0, Math.PI * 2)
        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        cxt.fill()
    }
}