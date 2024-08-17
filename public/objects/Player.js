class Player{
    constructor(x, y, radius, color, username) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.username = username
    }
    
    draw(cxt, color) {
        console.log(this.x, this.y)
        if(color == null){
            color = this.color
        }
        cxt.shadowColor = color
        // cxt.shadowBlur = 20
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        cxt.fillStyle = color
        cxt.fill()
        
        // cxt.save()

        cxt.font = '12px sans-serif'
        cxt.fillStyle = 'white'
        cxt.fillText(this.username, this.x-20, this.y)

        // cxt.restore()
    }
}