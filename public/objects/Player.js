class Player{
    constructor(x, y, clear_radius, cords, erase_cords, color, username) {
        this.cords = cords
        this.erase_cords = erase_cords
        this.color = color
        this.username = username
        this.clear_radius = clear_radius
        this.x = x
        this.y = y
    }    

    draw() { 

        cxt.shadowBlur = 5;               
        cxt.shadowColor = this.color;          
        cxt.shadowOffsetX = 0;             
        cxt.shadowOffsetY = 0;  
        cxt.beginPath()           
        cxt.moveTo(this.cords.head[0], this.cords.head[1])

        cxt.lineTo(this.cords.left[0], this.cords.left[1])

        cxt.lineTo(this.cords.right[0], this.cords.right[1])

        cxt.fillStyle = this.color
        cxt.fill()
        cxt.shadowBlur = 0

        cxt.font = '12px sans-serif'
        cxt.fillStyle = 'black'
        cxt.fillText(this.username, this.x-(this.username.length * 2.5), this.y)
        
    }

    erase() {   
        cxt.beginPath()
         
        cxt.moveTo(this.erase_cords.head[0], this.erase_cords.head[1])

        cxt.lineTo(this.erase_cords.left[0], this.erase_cords.left[1])

        cxt.lineTo(this.erase_cords.right[0], this.erase_cords.right[1])

        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        // cxt.fillStyle = "white"
        cxt.fill()
        cxt.shadowBlur = 0
    }
}
