class Box {                         //creating a class called Box
    constructor({position, imageSrc }){          //function called constructor is called when creating a box object "{}" in velocity and position makes that the order doesn't matter
        this.position = position  
        this.width = 30
        this.height = 50
        this.image = new Image() //creates HTML image in java
        this.image.src =imageSrc 
 
    }

    draw(){                        //draw function, where c.fillRect draws the box on canvas

    c.drawImage(this.image, this.position.x, this.position.y) //draw out image
    }


    update (){                     //function for moving objects
        this.draw()
    }

}
class Sprite {
    constructor( { position, imagageSrc, scale = 1, framesMax = 1, offset = {  x: 0, y:0}}) {
        this.position = position
        this.width = 50
        this.height = 150 
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = framesCurrent
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    
}


draw ()  {              //Canvas function to draw
    c.drawImage (this.image,
                this.frameCurrent *(this.image.width / this.framesMax),    //X-coordinate
                0,                                            //y-coordinate
                this.image.width / this.framesMax,       //crop image
                this.image.height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y, 
               ( this.image.width / this.framesMax )* this.scale, 
                this.image.height * this.scale)
}


update() {
    this.draw()
    this.framesElapsed ++

    if (this.framesElapsed % this.framesHold === 0)
    if (this.framesCurrent < this.framesMax -1)  {
      this.framesCurrent ++  
    } else {
        this.framesCurrent = 0
    }
    
}
}

class Fighter extends Sprite{                         //creating a class called Box
    constructor({position, velocity, color ="red", imagageSrc, scale = 1, framesMax = 1, offset = {  x: 0, y:0}}){          //function called constructor is called when creating a box object "{}" in velocity and position makes that the order doesn't matter
       super ({
        position,
        imageSrc,
        scale,
        framesMax,
        offset 
        
       })

        this.position = position  
        this.velocity = velocity 
        this.width = 30
        this.height = 50
        this.lastKey
        this.attackbox = {
            position: { x: this.position.x, y: this.position.y },
            offset, 
            x: 50, 
            y: 25,
            width: 50,
            height: 25
        };
       
          this.color = color
          this.isAttacking
          this.health = 100
          this.framesCurrent = framesCurrent
        this.framesElapsed = 0
        this.framesHold = 5
    }

   

    update (){                     //function for moving objects
        this.draw()


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y        // same as this.position.y = this.position.y + 10
        this.attackbox.position.x = this.position.x -this.attackbox.offset.x, 
        this.attackbox.position.y = this.position.y;
      
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 97){
            this.velocity.y = 0                  // prevent box falling down past canvas by comparing the current y position + height and velocity with canvas height
        } else this.velocity.y += gravity       // if object has not reached bottom of canvas -> gravity increased by 0.2                                                      
    }
    attack(){
        this.isAttacking = true 
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}
