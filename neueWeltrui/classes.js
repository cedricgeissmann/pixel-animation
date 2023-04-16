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
    constructor( { position, imagageSrc}) 
        this.position = position
        this.width = 50
        this.height = 150 
        this.image = new Image()
        this.image.src = imageSrc
    
}

draw () {               //Canvas function to draw
    c.drawImage (this.image, this position.x, this.position.y)
}

update() {
    this.draw()
}

class Fighter {                         //creating a class called Box
    constructor({position, velocity, color ="red", offset}){          //function called constructor is called when creating a box object "{}" in velocity and position makes that the order doesn't matter
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
    }

    draw(){                         //draw function, where c.fillRect draws the box on canvas
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        


        // attack box
        if(this.isAttacking){
            c.fillStyle = "green"
            c.fillRect(
                this.attackbox.position.x,
                this.attackbox.position.y,
                this.attackbox.width,
                this.attackbox.height
              );

        }

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
