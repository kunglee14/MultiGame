const center_to_corner_length = 50
const SPEED = 4

class Player{
    constructor(x, y, color, username) {
        this.x = x
        this.y = y
        this.color = color
        this.username = username
        this.cords = null
        this.erase_cords = null
        this.mouse_x = null
        this.mouse_y = null
        this.clear_radius = center_to_corner_length
        this.intervals_since_last_shot = 0
    }

    updateLocation(keycode){
        switch(keycode){
            case 'KeyW':
                this.y -= SPEED
                break
            case 'KeyA':
                this.x -= SPEED
                break

            case 'KeyS':
                this.y += SPEED
                break

            case 'KeyD':
                this.x += SPEED
                break
        }
    }

    #getCords(ang, length) {
        const x_cord = this.x + (length * Math.cos(ang))
        const y_cord = this.y - (length * Math.sin(ang))
        return [x_cord, y_cord]
    }

    updatePlayerVertCords(mouse_x, mouse_y, max_width, max_height){
        if(mouse_x != null && mouse_y != null){
            this.mouse_x = mouse_x
            this.mouse_y = mouse_y 
        }else{
            mouse_x = this.mouse_x
            mouse_y = this.mouse_y    
        }

        
        if(this.x < 0){
            this.x = 0
        } else if(this.x > max_width){
            this.x = max_width
        }

        if(this.y < 0){
            this.y = 0
        }else if(this.y > max_height){
            this.y = max_height
        }

        //Origin (0,0) is top left corner
        const dy = -(this.mouse_y - this.y) //Flipped since I want + Pi/4 to be top-right of character
        const dx = this.mouse_x - this.x
        var angle = Math.atan(dy/dx)
        // console.log(`(${this.x},${this.y}) -> (${this.mouse_x}, ${this.mouse_y}) at ${angle}`)
        if(dx < 0){
            angle += Math.PI  
        }

        const head_cords = this.#getCords(angle, center_to_corner_length)
        const left_cords = this.#getCords(Math.PI * (2/3) + angle, center_to_corner_length)
        const right_cords = this.#getCords(Math.PI * (4/3) + angle, center_to_corner_length)
        this.cords = {head:head_cords, left:left_cords, right:right_cords}

        const offset = 10
        const erase_head_cords = this.#getCords(angle, center_to_corner_length+offset)
        const erase_left_cords = this.#getCords(Math.PI * (2/3) + angle, center_to_corner_length+offset)
        const erase_right_cords = this.#getCords(Math.PI * (4/3) + angle, center_to_corner_length+offset)
        this.erase_cords = {head:erase_head_cords, left:erase_left_cords, right:erase_right_cords}
    }
}
module.exports = {Player}