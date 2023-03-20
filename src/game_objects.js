import EventHandler from "./event_handler.js"
import Game from "./game.js"
import {calculatePenetration} from "./collision_detector.js"
import { findAndRemoveFromList } from "./utils.js"

export class GameObject extends EventTarget {
  constructor(x, y, sheet) {
    super()
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

export class Stone extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, ground)
    this.row = 0
    this.col = 1
    Game.CD.layers["world"].push(this)
  }
  
  destroy() {
    findAndRemoveFromList(Game.map.tiles, this)
    findAndRemoveFromList(Game.CD.layers["world"], this)
  }
}

export class Tree extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, ground)
    this.row = 1
    this.col = 1
    Game.CD.layers["world"].push(this)
    Game.CD.layers["forest"].push(this)
  }
  
  destroy() {
    findAndRemoveFromList(Game.map.tiles, this)
    findAndRemoveFromList(Game.CD.layers["forest"], this)
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
    Game.CD.layers["world"].push(this)
    Game.CD.layers["forest"].push(this)

    this.addEventListener('collision', (e) => {
      this.handleCollision(e)
    })
  }

  handleCollision(e) {
    console.log("collision")
    const pen = calculatePenetration(this, e.detail)
    if (Math.abs(pen.x) < Math.abs(pen.y)){
    this.x = this.x - pen.x
    } 
    else {
    this.y = this.y - pen.y
    }
  }

  update() {
    this.eventHandler._handleEvents(this)
  }

  handle(ev) {
    if (ev === "KeyW") { this.move("up") }
    if (ev === "KeyS") { this.move("down") }
    if (ev === "KeyA") { this.move("left") }
    if (ev === "KeyD") { this.move("right") }
  }

  move(direction) {
    if (direction === "up") {
      this.y = this.y - this.speed
      this.row = 3
    } else if (direction === "down") {
      this.y = this.y + this.speed
      this.row = 0
    } else if (direction === "left") {
      this.x = this.x - this.speed
      this.row = 1
    } else if (direction === "right") {
      this.x = this.x + this.speed
      this.row = 2
    }
  }
}