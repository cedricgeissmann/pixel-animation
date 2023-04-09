const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const canvasStyles = getComputedStyle(canvas);

const canvasWidth = parseInt(canvasStyles.width, 10);
const canvasHeight = parseInt(canvasStyles.height, 10);

c.fillRect(0, 0, canvasWidth, canvasHeight);

class Box {                         //creating a class called Box
    constructor(position){          //function called constructor is called when creating a box object
        this.position = position    
    }

    draw(){                         //draw function, where c.fillRect draws the box on canvas
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, 50,150);
    }
}

const player = new Box({           // new box object with the name player and position (0,0)
    x: 0,
    y: 0
})

player.draw()

const enemy = new Box({         //create new box called enemy with position (400,100)
    x: 40,
    y: 10
})

enemy.draw()

console.log (player)