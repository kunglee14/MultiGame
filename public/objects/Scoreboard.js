class Scoreboard{
    constructor(){
        this.width = 200
        this.height = 400
        this.x = 0
        this.y = 0
    }

    setLocation(x,y){
        this.x = x;
        this.y = y;
    }

    setSize(width, height){
        this.width = width;
        this.height = height;
    }

    draw(){
        cxt.beginPath()
        cxt.moveTo(this.x, this.y)
        cxt.lineTo(this.x+this.width, this.y)
        cxt.lineTo(this.x+this.width, this.y+this.height)
        cxt.lineTo(this.x, this.y+this.height)
        cxt.lineTo(this.x, this.y)
        cxt.fillStyle = "rgba(74, 73, 69, .5)"
        cxt.fill()
    }

    erase(){

    }
}