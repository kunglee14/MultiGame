class Player{
    constructor(x, y, clear_radius, cords, color, username) {
        this.cords = cords
        this.color = color
        this.username = username
        this.clear_radius = clear_radius
        this.x = x
        this.y = y
    }    

    draw() { 
        cxt.shadowColor = this.color
        cxt.shadowBlur = 15

        cxt.beginPath()

        cxt.moveTo(this.cords.head[0], this.cords.head[1])

        cxt.lineTo(this.cords.left[0], this.cords.left[1])

        cxt.lineTo(this.cords.right[0], this.cords.right[1])

        cxt.fillStyle = this.color
        cxt.fill()

        cxt.font = '12px sans-serif'
        cxt.fillStyle = 'black'
        cxt.fillText(this.username, this.x-(this.username.length * 2.5), this.y)
    }

    erase() {
        // cxt.shadowColor = window.getComputedStyle(canvas).backgroundColor
        cxt.shadowBlur = 0
        
        cxt.beginPath()
        cxt.arc(this.x, this.y, this.clear_radius+10, 0, Math.PI * 2)
        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        // cxt.fillStyle = "white"
        cxt.fill()
    }
}
