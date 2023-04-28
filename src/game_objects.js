import {addAnimation, addCollision, addGravity, addProjectile, CollisionHandler, GravityHandler, HandlerManager} from "./event_handler.js"
import { findAndRemoveFromList } from "./utils.js"
import TileRegistry from "./tile_registry.js"
import { addCollisionEntry} from "./collision_detector.js"
import Camera from "./camera.js"
import Game from "./game.js"
import Map from "./map.js"

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
  constructor(x, y, options = {sheet, layer: "background"}) {
    this.sheet = options.sheet
    this.tileSize = 32
    this.x = x * this.tileSize
    this.y = y * this.tileSize
    this.col = 0
    this.row = 0
    this.layer = options.layer
    this.handlers = new HandlerManager([])
    TileRegistry.layers[this.layer].push(this)
  }

  /**
   * Zeichnet das Spiel-Objekt auf das Canvas. Das Spiel-Objekt
   * kennt dabei seine Position und welches Bild gezeichnet werden soll.
   * @param {CanvasRenderingContext2D} ctx Das Canvas, worauf das Spiel-Objekt gezeichnet werden soll.
   */
  draw(ctx) {
    // console.log(Game.canvas.width, Game.canvas.height, this.x, this.y)
    const transform = ctx.getTransform()
    // console.log(transform.e, transform.f)
    if (this.x > -(transform.e + this.tileSize) && this.y > -(transform.f + this.tileSize) && this.x < Game.canvas.width - transform.e && this.y < Game.canvas.height - transform.f) {
    ctx.drawImage(
      this.sheet,
      this.col * this.tileSize, this.row * this.tileSize, this.tileSize, this.tileSize,
      this.x, this.y, this.tileSize, this.tileSize
    )
    }
  }

  /**
   * Zerstört das Spiel-Objekt und entfernt es aus dem Spiel.
   */
  destroy() {
    findAndRemoveFromList(TileRegistry.layers[this.layer], this)
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
    const colHandler = this.handlers.get(CollisionHandler)
    if (colHandler == null) return
    if (colHandler.collisionTags.length > 0){
      let index = parseInt(this.x / this.tileSize) + parseInt(this.y / this.tileSize) * (Map.width + 1)
      addCollisionEntry(index, this)
      if (this.x % this.tileSize !== 0) {
        addCollisionEntry(index + 1, this)
      }
      if (this.y % this.tileSize !== 0) {
        addCollisionEntry(index + Map.width + 1, this)
      }
      if (this.x % this.tileSize !== 0 && this.y % this.tileSize !== 0) {
        addCollisionEntry(index + 1 + Map.width + 1, this)
      }
    }
  }
}

export class Background extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "background",
    })

    this.row = 1
    this.col = 0
  }
}

export class Sand extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
     super(x, y, {
      sheet: ground,
      layer: "world",
      collisionTags: ["world"]
    })
    this.row = 3.6
    this.col = 3
    addCollision(this, {collisionTags: ["world"]})
  }
}

export class Water extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
    })
    this.row = 0
    this.col = 1
    addCollision(this, {collisionTags: ["world"]})    
  }
}

export class ShootingStone extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
    })
    this.row = 0
    this.col = 1
    addProjectile(this, {
      speed: 1
    })
  }
}

export class Wall extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
    })
    this.row = 1
    this.col = 3
    addCollision(this, {collisionTags: ["world"]})
  }
}

export class Cave extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "world",
    })
    this.row = 1
    this.col = 2
    addCollision(this, {collisionTags: ["world"]})
  }
}



export class Air extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y,{
      sheet: ground,
      layer: "world",
    })
    this.row = 0
    this.col = 2
   
  }
}
  
export class Shells extends GameObject {
    constructor(x, y) {
      const ground = document.querySelector("#objects")
      super(x, y,{
        sheet: ground,
        layer: "world",
      })
      this.tileSize = 32
      this.row = 1
      this.col = 0
      addCollision(this, {collisionTags: ["pickups"]})

  } 
}

export class crown extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#objects")
    super(x, y,{
      sheet: ground,
      layer: "world",
    })
    this.tileSize = 32
    this.row = 1
    this.col = 1
    addCollision(this, {collisionTags: ["forest"]})

  
} 
}

export class waterlily extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#objects")
    super(x, y,{
      sheet: ground,
      layer: "world",
    })
    this.tileSize = 32
    this.row = 0
    this.col = 1
    addCollision(this, {collisionTags: ["pickups"]})

  
} 
}


export class seastar extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#objects")
    super(x, y,{
      sheet: ground,
      layer: "world",
    })
    this.tileSize = 32
    this.row = 0
    this.col = 0
    addCollision(this, {collisionTags: ["forest"]})

  
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
    constructor(x, y) }
    const img = document.querySelector("#character")
    super(x, y, {
      sheet: img,
      layer: "player",
    })
    
    this.row = 0
    this.col = 1
    this.speed = 3
    this.healamount = 2
    this.hp = 100
    this.maxHp = this.hp 

    document.querySelector("#hp-player-1").textContent = this.hp

  heal() 
    if (this.hp < (this.maxHp - this.healamount + 50)){
      this.hp = this.hp + this.healamount
      document.querySelector("#hp-player-1").textContent = this.hp
    this.tileSize = 64

    addGravity(this, {maxGravity: 3, gravityForce: 0.3 , jumpForce: -10})
    addAnimation(this, { framesPerAnimation: 15, numberOfFrames: 3})
    addCollision(this, { collisionTags: ["world", "pickups", "cave", "forest"] })
  }

  jump() 
    this.handlers.get(GravityHandler).jump(this)
  



  move(direction) ;{
     if (direction === "left") {
      this.dx = this.dx + (-1) * this.speed
      //this.row = 1
    } else if (direction === "right") {
      this.dx = this.dx + (1) * this.speed
      //this.row = 2
    }
  }



export class Player2 extends AnimatedGameObject {
  constructor(x, y) {
    const img = document.querySelector("#character2")
    super(x, y, {
      sheet: img,
      layer: "player",
    })
    
    this.row = 0
    this.col = 0
    this.speed = 3
    

    addGravity(this, {maxGravity: 3, gravityForce: 0.3 , jumpForce: -10})
    addAnimation(this, { framesPerAnimation: 15, numberOfFrames: 3})
    addCollision(this, { collisionTags: ["world", "pickups", "cave", "forest"] })
  }

  jump() {
    this.handlers.get(GravityHandler).jump(this)
  }



  move(direction) {
     if (direction === "left") {
      this.dx = this.dx + (-1) * this.speed
      //this.row = 1
    } else if (direction === "right") {
      this.dx = this.dx + (1) * this.speed
      //this.row = 1
    }
  }

}
