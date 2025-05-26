class Scoreboard{
    constructor(){
        this.width = 200
        this.height = 400
        this.x = 0
        this.y = 0
        this.scores = null
    }

    setLocation(x,y){
        this.x = x;
        this.y = y;
    }

    setSize(width, height){
        this.width = width;
        this.height = height;
    }

    setScores(scores){
        this.scores = scores
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

        // 186.1171875 246.5 at 36px font
        // 62.0390625 101.5 at 12px font
        // m = 0.165, 36px = 0.165(246.5) - 4.6725
        const font_size = Math.max(0.165*this.width - 4.6725, 7)
        cxt.font = `${font_size}px sans-serif`
        cxt.fillStyle = 'white'

        const side_padding = (this.width - cxt.measureText("Scoreboard").width) / 2
        cxt.fillText("Scoreboard", this.x+side_padding, this.y+Math.min(this.height*.1, 40))

        const startingY = this.y+Math.min(this.height*.1, 40) + 20
        for(let i = 0; i < this.scores.length; i++){
            cxt.font = '15px sans-serif'
            cxt.fillStyle = this.scores[i].color
            cxt.fillText(`${i+1}. ${this.scores[i].username} - ${this.scores[i].score}`, this.x+side_padding+20, startingY+(20*i))
        }
    }

    erase(){

    }
}