import { calculatePenetration } from "./collision_detector.js"
import { Enemy, Player,Cave, NPC, FallingStone, Nothing, Falldamage, Healthpotion, NPC2, Enemy2, Boss, FallingStone2, Jumppotion, NPC3, Enemy3, Borderb, Background, Falldamage2} from "./game_objects.js"
import Game from "./game.js"
import config from "./config.js"


export default class InputHandler {

  static events = new Set()
  static commands = []

  constructor() {
    // Setup Eventlisteners
    window.onkeydown = (ev) => {InputHandler.events.add(ev.code)}
    window.onkeyup = (ev) => {InputHandler.events.delete(ev.code)}
    Object.entries(config["keys"]).forEach(([key, callback]) => {
      new Command(key, callback)
    })
  }

  static handleAllEvents() {
    InputHandler.events.forEach((ev) => {
      InputHandler.commands.forEach(command => {
        if (command.key === ev) {
          command.callback()
        }
      })
    })
    
  }
}


class Command {
  constructor(key, callback) {
    this.key = key
    this.callback = callback
    InputHandler.commands.push(this)
  }
}

export class GravityHandler {
  constructor(options) {
    this.gravity = 0
    this.maxGravity = options.maxGravity
    this.jumpForce = options.jumpForce 
    this.gravityForce = options.gravityForce || 0
  }

  jump(gameObject) {
    if (gameObject.isStanding) {
      this.gravity = this.jumpForce
      gameObject.isStanding = false
    }
  }

  _handleEvents(gameObject) {
    gameObject.y = gameObject.y + this.gravity
    this.gravity = Math.min(this.gravity + this.gravityForce, this.maxGravity)
  }
}

export class HandlerManager {
  constructor(handlers) {
    this.handlers = [...handlers]
  }

  add(handler) {
    this.handlers.push(handler)
  }

  remove(handler) {
    this.handlers.splice(this.handlers.indexOf(handler), 1)
  }

  get(handlerType) {
    let result = this.handlers.filter(handler => handler instanceof handlerType)
    return result[0]
  }

  runAll(gameObject) {
    this.handlers.forEach(handler => handler._handleEvents(gameObject))
  }
}

export class CollisionHandler {
  _handleEvents(gameObject, options) {
    // Es soll nichts passieren wenn kein anderes Objekt gesetzt wird
    if (options == null) return

    // Wenn das andere Objekt der Spieler ist, soll nicht passieren
    if (options.other instanceof Player) return

    let collidingObject = options.other

    // Wenn das andere Objekt aus der Welt oder dem Wald ist,
    // soll eine Überschneidung vermieden werden, indem das
    // Objekt aus dem überschneidenden Objekt herausgedrückt wird.
    if (collidingObject.collisionTags.includes("world") || collidingObject.collisionTags.includes("forest")) {
      const pen = calculatePenetration(gameObject, collidingObject)
      if (Math.abs(pen.x) <= Math.abs(pen.y)) {
        gameObject.x = gameObject.x - pen.x
      } else {
        gameObject.y = gameObject.y - pen.y
        const gravityHandler = gameObject.handlers.get(GravityHandler)
        if (gravityHandler != null) {
          if (gravityHandler.gravity >= 0) {
            gameObject.isStanding = true
          }
          gravityHandler.gravity = 0
        }
      }}

      if (collidingObject instanceof FallingStone) {
        if (collidingObject.isFalling === false) {
        collidingObject.handlers.add (new GravityHandler({
          maxGravity: 2,
          gravityForce: 1
        }),)
      }
      }

      if (collidingObject instanceof FallingStone2) {
        if (collidingObject.isFalling === false) {
        collidingObject.handlers.add (new GravityHandler({
          maxGravity: 2,
          gravityForce: 1
        }),)
      }
      }

      if (collidingObject instanceof Enemy2) {
          Game.loadMap("maps/map-02-2.txt");
        }

      if (collidingObject instanceof Boss) {
        if ( Game.currentFrame - gameObject.lasthit > 6) {
        gameObject.lasthit = Game.currentFrame;
        gameObject.loseLife(1)
        console.log(gameObject.php)
        
        if (gameObject.php === 0) {
          Game.loadMap("maps/map-03.txt");
        }
      }
      }

      if(gameObject instanceof Boss && collidingObject instanceof Nothing) {
        gameObject.ehp -= 5
        collidingObject.destroy()
        if (gameObject.ehp === 0) {
          gameObject.destroy()
          Game.loadMap("maps/map-04.txt")
        }
      }

      if (collidingObject instanceof Enemy) {
        if ( Game.currentFrame - gameObject.lasthit > 12) {
        gameObject.lasthit = Game.currentFrame;
        gameObject.loseLife(1)
        console.log(gameObject.php)
        
        if (gameObject.php === 0) {
          Game.loadMap("maps/map-01.txt");
        }
      }
      }

      if (collidingObject instanceof Enemy3) {
        if ( Game.currentFrame - gameObject.lasthit > 6) {
        gameObject.lasthit = Game.currentFrame;
        gameObject.loseLife(1)
        console.log(gameObject.php)
        
        if (gameObject.php === 0) {
          Game.loadMap("maps/map-03.txt");
        }
      }
      }

      if(gameObject instanceof Enemy && collidingObject instanceof Nothing) {
        gameObject.destroy()
        collidingObject.destroy()
      }

      if(gameObject instanceof Enemy3 && collidingObject instanceof Nothing) {
        gameObject.destroy()
        collidingObject.destroy()
      }

     if (collidingObject instanceof Falldamage ) {
        Game.loadMap("maps/map-01.txt");
     }

     if (collidingObject instanceof Falldamage2 ) {
      Game.loadMap("maps/map-03.txt");
   }

     if (collidingObject instanceof Cave ) {
        Game.loadMap("maps/map-01.txt");
     } 

     if (collidingObject instanceof Healthpotion) {
      gameObject.gainLife(5)
      collidingObject.destroy();
     }

    if (collidingObject instanceof Jumppotion) {
      gameObject.handlers.get(GravityHandler).jumpForce = -20
      collidingObject.destroy();
    }
    

     if (collidingObject instanceof NPC ) {
        Game.loadMap("maps/map-02.txt");
     } 

     if (collidingObject instanceof NPC2 ) {
        Game.loadMap("maps/map-03.txt");
     } 

   if (gameObject instanceof Player && collidingObject instanceof NPC3) {
    Game.loadMap("maps/map-04.txt");

  }}
}


export class AnimationHandler {
  constructor(options) {
    this.frameCounter = 0
    this.framesPerAnimation = options.framesPerAnimation
    this.numberOfFrames = options.numberOfFrames
  }

  _handleEvents(gameObject) {
    // Only run the animation if the object moved
    if (gameObject.dx != 0 || gameObject.dy != 0) {
      this.frameCounter++
      if (this.frameCounter >= this.framesPerAnimation) {
        gameObject.col++
        if (gameObject.col >= this.numberOfFrames) {
          gameObject.col = 0
        }
        this.frameCounter = 0
      }
    }

  }
}