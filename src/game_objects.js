import EventHandler from "./event_handler.js"
import Game from "./game.js"
import {calculatePenetration} from "./collision_detector.js"
import { findAndRemoveFromList } from "./utils.js"

export class GameObject extends EventTarget {
  constructor(x, y, sheet, layers) {
    super()
    this.sheet = sheet
    this.x = x
    this.y = y
    this.tileSize = 32
    this.col = 0
    this.row = 0
    this.layers = layers
    this.layers.forEach(layer => {
      Game.CD.layers[layer].push(this)
    })
  }

  draw(ctx) {
    ctx.drawImage(
      this.sheet,
      this.col * this.tileSize, this.row * this.tileSize, this.tileSize, this.tileSize,
      this.x * this.tileSize, this.y * this.tileSize, this.tileSize, this.tileSize
    )
  }

  destroy() {
    findAndRemoveFromList(Game.map.tiles, this)
    this.layers.forEach(layer => {
      findAndRemoveFromList(Game.CD.layers[layer], this)
    })
  }
}

export class Background extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, ground, [])
    this.row = 0
    this.col = 0
  }
}

export class Stone extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, ground, ["world"])
    this.row = 0
    this.col = 1
  }
}

export class Tree extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, ground, ["forest"])
    this.row = 1
    this.col = 1
  }
}

export class Mushroom extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, ground, ["pickups"])
    this.row = 0
    this.col = 2
  }
}

class AnimatedGameObject extends GameObject {
  constructor(x, y, sheet, layers) {
    super(x, y, sheet, layers)
    this.frameCounter = 0
    this.dx = 0
    this.dy = 0
  }

  update() {
    this.x = this.x + this.dx
    this.y = this.y + this.dy

    // Only run the animation if the object moved
    if (this.dx != 0 || this.dy != 0) {
      this.frameCounter++
      if (this.frameCounter >= 15) {
        this.col++
        if (this.col >= 2) {
          this.col = 0
        }
        this.frameCounter = 0
      }
    }

    this.dx = 0
    this.dy = 0
  }
}

export class Player extends AnimatedGameObject {
  constructor(x, y) {
    const img = document.querySelector("#character")
    super(x, y, img, ["world", "forest", "pickups"])
    this.row = 0
    this.col = 1
    this.speed = 3 / this.tileSize
    this.eventHandler = new EventHandler()

    this.addEventListener('collision', (e) => {
      this.handleCollision(e.detail)
    })
  }

  handleCollision(collidingObject) {
    if (collidingObject.layers.includes("world") || collidingObject.layers.includes("forest")) {
      const pen = calculatePenetration(this, collidingObject)
      if (Math.abs(pen.x) <= Math.abs(pen.y) ) {
        this.x = this.x - pen.x
      } else {
        this.y = this.y - pen.y
      }
    }
    if (collidingObject.layers.includes("pickups")) {
      collidingObject.destroy()
    }
  }

  update() {
    super.update()
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
      this.dy = this.dy + (-1) * this.speed
      this.row = 3
    } else if (direction === "down") {
      this.dy = this.dy + (1) * this.speed
      this.row = 0
    } else if (direction === "left") {
      this.dx = this.dx + (-1) * this.speed
      this.row = 1
    } else if (direction === "right") {
      this.dx = this.dx + (1) * this.speed
      this.row = 2
    }
  }
}