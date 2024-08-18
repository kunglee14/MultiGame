class Player{
    constructor(x, y, mouse_x, mouse_y, color, username) {
        this.x = x
        this.y = y
        this.mouse_x = mouse_x
        this.mouse_y = mouse_y
        this.color = color
        this.username = username
    }    

    #getCoords(angle) {
        const center_to_corner_length = 50
        const x_cord = this.x + (center_to_corner_length * Math.cos(angle))
        const y_cord = this.y - (center_to_corner_length * Math.sin(angle))
        return [x_cord, y_cord]
    }

    shoot(mouse_x, mouse_y){
        
        const cursor_offset_x = 10
        const dy = -(mouse_y - p1.y) //Flipped since I want + Pi/4 to be top-right of character
        const dx = mouse_x - cursor_offset_x - p1.x
        const angle = Math.atan(dy/dx)
        console.log("Rads: "+ angle + ", Deg : " + (angle * 180 / Math.PI))
        const bullet = new Bullet(1,1,1)
        bullet.draw()
    }

    draw(cxt) { 
        cxt.shadowColor = this.color
        cxt.shadowBlur = 10

        const cursor_offset_y = 20
        const cursor_offset_x = 10

        //Origin (0,0) is top left corner
        const dy = -(this.mouse_y - p1.y) //Flipped since I want + Pi/4 to be top-right of character
        const dx = this.mouse_x - cursor_offset_x - p1.x
        var angle = Math.atan(dy/dx)
        if(dx < 0){
            angle = Math.PI + Math.atan(dy/dx)   
        }
        // if(dx < 0 && dy < 0){
        //     angle = -Math.PI + Math.atan(dy/dx)
        // }

        cxt.beginPath()

        const cords1 = this.#getCoords(angle)
        cxt.moveTo(cords1[0],cords1[1])

        const cords2 = this.#getCoords(Math.PI * (2/3) + angle)
        cxt.lineTo(cords2[0], cords2[1])

        const cords3 = this.#getCoords(Math.PI * (4/3) + angle)
        cxt.lineTo(cords3[0], cords3[1])

        cxt.fillStyle = this.color
        cxt.fill()

        cxt.font = '12px sans-serif'
        cxt.fillStyle = 'white'
        cxt.fillText(this.username, this.x-(this.username.length * 2.5), this.y)
    }

    remove(cxt) {
        cxt.shadowColor = window.getComputedStyle(canvas).backgroundColor
        cxt.shadowBlur = 0
        
        const center_to_corner_length = 50 + 10
        cxt.beginPath()
        cxt.arc(this.x, this.y, center_to_corner_length, 0, Math.PI * 2)
        cxt.fillStyle = window.getComputedStyle(canvas).backgroundColor
        cxt.fill()
    }
}