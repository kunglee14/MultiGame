class Bullet{
    constructor(x, y, angle, radius, color){
        this.x = x
        this.y = y
        this.angle = angle
        this.radius = radius
        this.color = color
    }
    
    draw(){
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        cxt.fillStyle = this.color
        cxt.fill()
    }
    erase(){
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.radius+5, 0, Math.PI * 2)
        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        cxt.fill()
    }
}