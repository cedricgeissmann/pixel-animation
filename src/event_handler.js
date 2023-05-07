import { calculatePenetration } from "./collision_detector.js"
import { Player } from "./game_objects.js"
import Game from "./game.js"
import config from "./config.js"

export function addGravity(gameObject, gravityOptions) {
  gameObject.handlers.add(new GravityHandler(gravityOptions))
}

export function addAnimation(gameObject, animationOptions) {
  const handler = new AnimationHandler(animationOptions);
  gameObject.handlers.add(handler);
  return handler;
}

export function addCollision(gameObject, collisionOptions) {
  gameObject.handlers.add(new CollisionHandler(collisionOptions))
}

export function addProjectile(gameObject, projectileOptions) {
  gameObject.handlers.add(new ProjectileHandler(projectileOptions))
}


export default class InputHandler {

  static events = new Set()
  static commands = []

  constructor() {
    // Setup Eventlisteners
    window.onkeydown = (ev) => {InputHandler.events.add(ev.code)}
    window.onkeyup = (ev) => {InputHandler.events.delete(ev.code)}
    Object.entries(config["keys"]).forEach(([key, callback]) => {
      if (typeof callback === "function") {
        new Command(key, callback)
      } else if (typeof callback === "object") {
        new Command(key, callback.callback, callback.cooldown)
      }
    })
  }

  static handleAllEvents() {
    InputHandler.events.forEach((ev) => {
      InputHandler.commands.forEach(command => {
        if (command.key === ev && command.ready()) {
          command.callback()
          command.calledOnFrame = Game.currentFrame
        }
      })
    })
    
  }
}


class Command {
  constructor(key, callback, cooldown = 0) {
    this.key = key
    this.callback = callback
    this.cooldown = cooldown
    this.calledOnFrame = 0
    InputHandler.commands.push(this)
  }

  ready() {
    return Game.currentFrame - this.calledOnFrame >= this.cooldown
  }
}

export class ProjectileHandler {
  constructor(options) {
    this.speed = options.speed || 0
  }

  _handleEvents(gameObject) {
    gameObject.x = gameObject.x + this.speed
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
  constructor(options = {collisionTags: []}) {
    this.collisionTags = options.collisionTags
  }

  _handleEvents(gameObject, options) {
    // Es soll nichts passieren wenn kein anderes Objekt gesetzt wird
    if (options == null) return

    // Wenn das andere Objekt der Spieler ist, soll nicht passieren
    if (options.other instanceof Player) return

    let collidingObject = options.other

    // Wenn das andere Objekt aus der Welt oder dem Wald ist,
    // soll eine Überschneidung vermieden werden, indem das
    // Objekt aus dem überschneidenden Objekt herausgedrückt wird.
    if (matchCollisionTags(collidingObject, ["world", "forest"])) {
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
      }
    }

    if (matchCollisionTags(collidingObject, ["cave"])) {
      Game.loadMap("maps/map-02.txt")
    }

    // Wenn das kollidierende Objekt aus Pickups ist, wird es entfernt.
    if (matchCollisionTags(collidingObject, ["pickups"])) {
      collidingObject.destroy()
    }
  }
}

function matchCollisionTags(collidingObject, tags) {
  const colHandler = collidingObject.handlers.get(CollisionHandler)
  if (colHandler != null) {
    for (let tag of tags) {
      if (colHandler.collisionTags.includes(tag) == true) {
        return true
      }
    }
  }
  return false
}

export class AnimationHandler {
  constructor(options) {
    this.frameCounter = 0
    this.framesPerAnimation = options.framesPerAnimation
    this.numberOfFrames = options.numberOfFrames
    this.playKeyKAnimation = false;
    this.keyKReleased = true;
  }

  get isKeyKAnimationPlaying() {
    return this.playKeyKAnimation;
  }

  _handleEvents(gameObject) {

    // Only run the animation if the object moved

    ///attack1 (stich) animation wenn K gedrückt wird
    if(InputHandler.events.has("KeyK") && !this.playKeyKAnimation && this.keyKReleased) {
      this.playKeyKAnimation = true;
      this.keyKReleased = false;
      }
    
      if (!InputHandler.events.has("KeyK")) {
      this.keyKReleased = true;
    }
    
    if (this.playKeyKAnimation) {
      gameObject.row = 4 * 64
      //attacke nach rechts
      if (gameObject.col >= 2144) {
        this.frameCounter++
        //verschiedene tile.width da nicht alle frames gleich breit sind --> dynamische tile.width hinzugefügt
        if (this.frameCounter >= this.framesPerAnimation) {

          if (gameObject.col >= 2144 && gameObject.col < 2480) { 
          gameObject.tileWidth = 48
          gameObject.col += 48
          }

          if(gameObject.col >= 2480 && gameObject.col < 2864){ 
            gameObject.tileWidth = 96
            gameObject.col += 96
          }

          if(gameObject.col >= 2864 && gameObject.col < 3024){ 
            gameObject.tileWidth = 80
            gameObject.col += 80
          }

          if(gameObject.col >= 3024 && gameObject.col < 3088){ 
            gameObject.tileWidth = 64
            gameObject.col += 64
          }

          if(gameObject.col >= 3088 && gameObject.col < 3184){ 
            gameObject.tileWidth = 48
            gameObject.col += 48
          }

        if (gameObject.col >= 2144+1040) {
            gameObject.col = 2144
            this.playKeyKAnimation = false;
          }
          
          this.frameCounter = 0
        }
      }
      //für attacke nach links
      if (gameObject.col < 2144) {
        this.frameCounter++
        
        if (this.frameCounter >= this.framesPerAnimation) {

          if (gameObject.col <= 2096 && gameObject.col >= 1808+48) { 
            gameObject.col -= 48
            gameObject.tileWidth = 48
          }

          else if(gameObject.col < 1808+48 && gameObject.col >= 1424+48){ 
            gameObject.col -= 96
            gameObject.tileWidth = 96
          }

          else if(gameObject.col < 1424+48 && gameObject.col >= 1264+48 ){ 
            gameObject.col -= 80
            gameObject.tileWidth = 80
          }

          else if(gameObject.col < 1264+48 && gameObject.col >= 1200+48 ){ 
            gameObject.col -= 64
            gameObject.tileWidth = 64
          }

          else if(gameObject.col < 1200+48 && gameObject.col >=1104+48){ 
            gameObject.col -= 48
            gameObject.tileWidth = 48
          }

        if (gameObject.col < 1104+48) {
            gameObject.col = 2096
            this.playKeyKAnimation = false;
          }
          
          this.frameCounter = 0
        }
      }
      
    }
    //animationen für idle und run spielen nur ab wenn attacke nicht ausgeführt wird
    else {
    if(gameObject.dx == 0 && gameObject.dy == 0 ) {
      gameObject.row = 0
      gameObject.tileWidth = 48
      if (gameObject.col >= 2144) {
        this.frameCounter++
        if (this.frameCounter >= this.framesPerAnimation*2) {
          gameObject.col += gameObject.tileWidth 
          if (gameObject.col >= this.numberOfFrames * gameObject.tileWidth+2144) {
            gameObject.col = 2144
          }
          this.frameCounter = 0
        }
      }
      else 
        this.frameCounter++
        if (this.frameCounter >= this.framesPerAnimation*2) {
          gameObject.col -= gameObject.tileWidth 
          if (gameObject.col <= 2143 - this.numberOfFrames * gameObject.tileWidth) {
            gameObject.col = 2096
          }
          this.frameCounter = 0
      }
    }
//////////////
  // nach oben oder unten laufen code
    else 
    if (gameObject.dy != 0) {
      gameObject.row = 64
      gameObject.tileWidth = 48
      if (gameObject.col >= 2144) {
        this.frameCounter++
      if (this.frameCounter >= this.framesPerAnimation) {
        gameObject.col += gameObject.tileWidth 
        if (gameObject.col >= this.numberOfFrames * gameObject.tileWidth+2144) {
          gameObject.col = 2144
        }
        this.frameCounter = 0
      }
      }
      else //falls man nach links zuletzt geschaut hat läuft man nach oben und unten mit dem blick zur gleichen seite
      this.frameCounter++
      if (this.frameCounter >= this.framesPerAnimation) {
        gameObject.col -= gameObject.tileWidth 
        if (gameObject.col <= 2143 - this.numberOfFrames * gameObject.tileWidth ) {
          gameObject.col = 2096
        }
        this.frameCounter = 0
      }
    }
    
    // nach rechts laufen
    else if (gameObject.dx > 0 ) {
      gameObject.row = 64
      gameObject.tileWidth = 48
      //damit man sich instant umdreht
      if (gameObject.col < 2144){
        gameObject.col = 2144
      }
      this.frameCounter++
      if (this.frameCounter >= this.framesPerAnimation) {
        gameObject.col += gameObject.tileWidth 
        if (gameObject.col >= this.numberOfFrames * gameObject.tileWidth+2144) {
          gameObject.col = 2144
        }
        this.frameCounter = 0
      }
    }
    // nach links laufen
    else if (gameObject.dx < 0 || gameObject.dy != 0) {
      gameObject.row = 64
      gameObject.tileWidth = 48
      //damit man sich instant umdreht
      if (gameObject.col > 2144){
        gameObject.col = 2096
      }
      this.frameCounter++
      if (this.frameCounter >= this.framesPerAnimation) {
        gameObject.col -= gameObject.tileWidth 
        if (gameObject.col <= 2143 - this.numberOfFrames * gameObject.tileWidth ) {
          gameObject.col = 2096
        }
        this.frameCounter = 0
      }
    }

    }  
  }
}