import {AnimationHandler, CollisionHandler, GravityHandler, HandlerManager} from "./event_handler.js"
import { findAndRemoveFromList } from "./utils.js"
import TileRegistry from "./tile_registry.js"
import CollisionDetector from "./collision_detector.js"
import Camera from "./camera.js"
import Game from "./game.js"

/**
 * Dies ist die Basisklasse für alle Spiel-Objekte.
 * 
 * Wenn ein spezialisiertes Spiel-Objekt erzeugt wird, dann soll es 
 * immer diese Klasse erweitern. Wenn die Funktionen von der Basisklasse
 * überschrieben werden, sollten diese immer zuerst mit `super.function()` 
 * aufgerufen werden, so das die eigentliche Funktionalität der Spiel-Objekte
 * erhalten bleibt.
 */
export class GameObject {
  constructor(x, y, options = {sheet, layer: "background", collisionTags: []}) {
    this.sheet = options.sheet
    this.tileSize = 32
    this.x = x * this.tileSize
    this.y = y * this.tileSize
    this.col = 0
    this.row = 0
    this.layer = options.layer
    this.handlers = new HandlerManager([])
    TileRegistry.layers[this.layer].push(this)
    this.collisionTags = options.collisionTags
    this.collisionTags.forEach(tag => {
      CollisionDetector.layers[tag].push(this)
    })
  }

  /**
   * Zeichnet das Spiel-Objekt auf das Canvas. Das Spiel-Objekt
   * kennt dabei seine Position und welches Bild gezeichnet werden soll.
   * @param {CanvasRenderingContext2D} ctx Das Canvas, worauf das Spiel-Objekt gezeichnet werden soll.
   */
  draw(ctx) {
    ctx.drawImage(
      this.sheet,
      this.col * this.tileSize, this.row * this.tileSize, this.tileSize, this.tileSize,
      this.x, this.y, this.tileSize, this.tileSize
    )
  }

  /**
   * Zerstört das Spiel-Objekt und entfernt es aus dem Spiel.
   */
  destroy() {
    findAndRemoveFromList(TileRegistry.layers[this.layer], this)
    this.collisionTags.forEach(tag => {
      findAndRemoveFromList(CollisionDetector.layers[tag], this)
    })
  }

  /**
   * Berechne die Position und andere Eigenschaften des 
   * Spiel-Objekts neu. Wie das gemacht wird, wird in den 
   * verschieden Handlers angegeben. Ein Spiel-Objekt kann
   * z.B. einen Gravitations-Handler haben, dieser fügt dann
   * Gravitation für dieses Spiel-Objekt hinzu und berechnet die 
   * y-Position des Spiel-Objekts neu.
   */
  update(){
    this.handlers && this.handlers.runAll(this)
  }


}






export class Backgroundgreen extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#hinter")
    super(x, y, {
      sheet: ground,
      layer: "background",
      collisionTags: ["background"]
    })

    this.row = 0
    this.col = 0
  }
}

export class Backgroundmixed extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#hinter")
    super(x, y, {
      sheet: ground,
      layer: "background",
      collisionTags: []
    })

    this.row = 0
    this.col = 1
  }
}

export class Backgroundred extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#hinter")
    super(x, y, {
      sheet: ground,
      layer: "background",
      collisionTags: []
    })

    this.row = 0
    this.col = 2
  }
}

  
  
export class Baumstumpf extends GameObject {
    constructor(x, y) {
      super(x, y, {
        sheet: ground,
        layer: "world",
        collisionTags: ["world"]
      })
      this.col = 0
      this.row = 1
    }
  }
  

  

  
    
export class Flower extends GameObject {
    constructor(x, y) {
      super(x, y, {
        sheet: ground,
        layer: "background",
        collisionTags: ["pickups"]
      })
      this.col = 3
      this.row = 0
    }
  }

 
export class Stone extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
      collisionTags: ["world"]
    })
    this.row = 0
    this.col = 1
  }
}

export class Wall extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
      collisionTags: ["world"]
    })
    this.row = 1
    this.col = 3
  }
}

export class Cave extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
      collisionTags: ["cave"]
    })
    this.row = 1
    this.col = 2
  }
}


export class Tree extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
      collisionTags: ["forest"]
    })
    this.row = 1
    this.col = 1
  }
}

export class Mushroom extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "item",
      collisionTags: ["pickups"]
    })
    this.row = 0
    this.col = 2
  }
}

class AnimatedGameObject extends GameObject {
  constructor(x, y, options) {
    super(x, y, options)
    this.frameCounter = 0
    this.dx = 0
    this.dy = 0
  }

  update() {
    super.update()
    this.x = this.x + this.dx
    this.y = this.y + this.dy
    this.dx = 0
    this.dy = 0
  }
}


export class Player extends AnimatedGameObject {
  constructor(x, y) {
    const img = document.querySelector("#character")
    super(x, y, {
      sheet: img,
      layer: "player",
      collisionTags: ["world", "pickups", "cave", "forest", "background"]
    })
    this.hp = 100
    this.dmg = 10
    this.row = 1
    this.col = 0
    this.speed = 5
    let doDmg = this.dmg
    this.handlers = new HandlerManager([
      new CollisionHandler(),
      //new AnimationHandler({ framesPerAnimation: 15, numberOfFrames: 3})
    ])
  }
    
    loseSpeed(amount) {
      this.speed = this.speed - amount
      const speedElem = document.querySelector("#SPEED")
    }
  
    getSpeed(amount) {
      this.speed = this.speed + amount
      console.log(this.speed)
      const speedElem = document.querySelector("#SPEED")
    }


  
  


  handle(ev) {
    if (ev === "KeyW") { this.move("up") }
    else if (ev === "KeyS") { this.move("down") }
    else if (ev === "KeyD") { this.move("right")}
    else if (ev === "KeyA") { this.move("left")}

  }
  jump() {
    this.handlers.get(GravityHandler).jump(this)
  }

  update() {
    super.update()
  }

  move(direction) {
    if (direction === "up") {
      this.dy = this.dy + (-1) * this.speed
      this.row = 0
      this.col = 1
    } else if (direction === "down") {
      this.dy = this.dy + (1) * this.speed
      this.row = 0
      this.col = 0
    } else if (direction === "left") {
      this.dx = this.dx + (-1) * this.speed
      this.row = 1
      this.col = 1
      Camera.shiftBackground(1)
    } else if (direction === "right") {
      this.dx = this.dx + (1) * this.speed
      this.row = 1    
      this.col = 0
      Camera.shiftBackground(-1)
    }
}

}


export class Player2 extends Player {
  constructor(x, y) {
    const img = document.querySelector("#character")
    super(x, y)
    this.hp = 100
    this.row = 1
    this.col = 3
    this.dmg = 10
    this.speed = 5
  }


  loseSpeed(amount) {
    this.speed = this.speed - amount
    const speedElem = document.querySelector("#player2-SPEED")
  }

  getSpeed(amount) {
    this.speed = this.speed + amount
    const speedElem = document.querySelector("#player2-SPEED")
  }



  handle(ev) {
    if (ev === "ArrowUp") { this.move("up") }
    else if (ev === "ArrowDown") { this.move("down") }
    else if (ev === "ArrowRight") { this.move("right")}
    else if (ev === "ArrowLeft") { this.move("left")}
  }

  move(direction) {
    if (direction === "up") {
      this.dy = this.dy + (-1) * this.speed
      this.row = 0
      this.col = 3 

    } else if (direction === "down") {
      this.dy = this.dy + (1) * this.speed
      this.row = 0
      this.col = 2

    } else if (direction === "left") {
      this.dx = this.dx + (-1) * this.speed
      this.row = 1
      this.col = 3

    } else if (direction === "right") {
      this.dx = this.dx + (1) * this.speed
      this.row = 1
      this.col = 2

    }
    
  }

  attack() {
    console.log(Game.player.x, Game.player2.x)
    console.log(Game.player.y, Game.player2.y)
  }
}
