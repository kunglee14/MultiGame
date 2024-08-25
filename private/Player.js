const center_to_corner_length = 50
const SPEED = 10

class Player{
    constructor(x, y, color, username, width, height) {
        this.x = x
        this.y = y
        this.color = color
        this.username = username
        this.cords = null
        this.mouse_x = null
        this.mouse_y = null
        this.clear_radius = center_to_corner_length
        this.max_width = width
        this.max_height = height
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

    #getCords(ang) {
        const x_cord = this.x + (center_to_corner_length * Math.cos(ang))
        const y_cord = this.y - (center_to_corner_length * Math.sin(ang))
        return [x_cord, y_cord]
    }

    updatePlayerVertCords(mouse_x, mouse_y){
        if(mouse_x != null && mouse_y != null){
            this.mouse_x = mouse_x
            this.mouse_y = mouse_y 
        }else{
            mouse_x = this.mouse_x
            mouse_y = this.mouse_y    
        }

        
        if(this.x < 0){
            this.x = 0
        } else if(this.x > this.max_width){
            this.x = this.max_width
        }

        if(this.y < 0){
            this.y = 0
        }else if(this.y > this.max_height){
            this.y = this.max_height
        }

        //Origin (0,0) is top left corner
        const dy = -(this.mouse_y - this.y) //Flipped since I want + Pi/4 to be top-right of character
        const dx = this.mouse_x - this.x
        var angle = Math.atan(dy/dx)
        if(dx < 0){
            angle = Math.PI + Math.atan(dy/dx)   
        }

        const head_cords = this.#getCords(angle)
        const left_cords = this.#getCords(Math.PI * (2/3) + angle)
        const right_cords = this.#getCords(Math.PI * (4/3) + angle)
        this.cords = {head:head_cords, left:left_cords, right:right_cords}
    }
}
module.exports = {Player}