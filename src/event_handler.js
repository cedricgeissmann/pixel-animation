import { calculatePenetration } from "./collision_detector.js"
import { Player } from "./game_objects.js"

export default class EventHandler {
  constructor() {
    this.events = new Set()
    // Setup Eventlisteners
    window.onkeydown = (ev) => {this.events.add(ev.code)}
    window.onkeyup = (ev) => {this.events.delete(ev.code)}
  }

  _handleEvents(gameObject) {
    this.events.forEach((ev) => gameObject.handle(ev))
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
      gameObject.isJumping = true
    } else if (gameObject.isJumping && this.gravity > 0) {
      this.gravity = this.jumpForce
      gameObject.isStanding = false
      gameObject.isJumping = false
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
        if (gameObject.handlers.get(GravityHandler).gravity >= 0) {
          gameObject.isStanding = true
        }
        gameObject.handlers.get(GravityHandler).gravity = 0
      }
    }

    // Wenn das kollidierende Objekt aus Pickups ist, wird es entfernt.
    if (collidingObject.collisionTags.includes("pickups")) {
      collidingObject.destroy()
    }
  }
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