class Player{
    constructor(x, y, angle, color, username) {
        this.x = x
        this.y = y
        this.angle = angle
        this.color = color
        this.username = username
    }    

    draw(cxt) { 
        cxt.shadowColor = this.color
        cxt.shadowBlur = 10

        const length = 50
        cxt.beginPath()

        const angle1 = this.angle
        cxt.moveTo(this.x + ((length * Math.cos(angle1))), this.y - (length * Math.sin(angle1)))

        const angle2 = this.angle + Math.PI * (2/3)
        cxt.lineTo(this.x + (length * Math.cos(angle2)), this.y - (length * Math.sin(angle2)))

        const angle3 = this.angle + Math.PI * (4/3)
        cxt.lineTo(this.x + (length * Math.cos(angle3)), this.y - (length * Math.sin(angle3)))

        cxt.fillStyle = this.color
        cxt.fill()

        cxt.font = '12px sans-serif'
        cxt.fillStyle = 'white'
        cxt.fillText(this.username, this.x-(this.username.length * 2.5), this.y)
    }

    remove(cxt) {
        cxt.shadowColor = window.getComputedStyle(canvas).backgroundColor
        cxt.shadowBlur = 0
        
        const length = 70
        cxt.beginPath()
        cxt.arc(this.x, this.y, length, 0, Math.PI * 2)
        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        cxt.fill()
    }
}