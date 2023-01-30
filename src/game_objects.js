import EventHandler from "./event_handler.js"

export class GameObject {
  constructor(x, y, sheet) {
    this.sheet = sheet
    this.x = x
    this.y = y
    this.tileSize = 32
    this.col = 0
    this.row = 0
  }

  draw(ctx) {
    ctx.drawImage(
      this.sheet,
      this.col * this.tileSize, this.row * this.tileSize, this.tileSize, this.tileSize,
      this.x * this.tileSize, this.y * this.tileSize, this.tileSize, this.tileSize
    )
  }
}

export class Background extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, ground)
    this.row = 0
    this.col = 0
  }
}

export class Tree extends GameObject {
    constructor(x, y) {
      super(x, y, ground)
      this.col = 1
      this.row = 1
    }
  }
  
export class Stone extends GameObject {
    constructor(x, y) {
      super(x, y, ground)
      this.col = 1
      this.row = 0
    }
  }
  
  
  
export class Baumstumpf extends GameObject {
    constructor(x, y) {
      super(x, y, ground)
      this.col = 0
      this.row = 1
    }
  }
  
export class Hoehle extends GameObject {
    constructor(x, y) {
      super(x, y, ground)
      this.col = 2
      this.row = 1
    }
  }
  
export class Pilz extends GameObject {
    constructor(x, y) {
      super(x, y, ground)
      this.col = 2
      this.row = 0
    }
  }
  
  
export class  Wand extends GameObject {
    constructor(x, y) {
      super(x, y, ground)
      this.col = 3
      this.row = 1
    }
  }
  
export class Flower extends GameObject {
    constructor(x, y) {
      super(x, y, ground)
      this.col = 3
      this.row = 0
    }
  }

 

export class Player extends GameObject {
  constructor(x, y) {
    const img = document.querySelector("#character")
    super(x, y, img)
    this.row = 0
    this.col = 1
    this.speed = 3 / this.tileSize
    this.eventHandler = new EventHandler()
  }

  update() {
    this.eventHandler._handleEvents(this)
  }

  handle(ev) {
    if (ev === "KeyW") { this.move("up") }
    else if (ev === "KeyS") { this.move("down") }
    else if (ev === "KeyD") { this.move("right")}
    else if (ev === "KeyA") { this.move("left")}
  }

  move(direction) {
    if (direction === "up") {
      this.y = this.y - this.speed
      this.row = 3
    }
    else if (direction === "down") {
      this.y = this.y + this.speed
      this.row = 0
    }
    else if (direction === "right") {
      this.x = this.x + this.speed
      this.row = 2
    }
    else if (direction === "left") {
      this.x = this.x - this.speed
      this.row = 1
    }
}
}
