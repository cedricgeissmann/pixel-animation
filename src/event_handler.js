import { calculatePenetration, } from "./collision_detector.js"
import { Enemy, Player, } from "./game_objects.js"
import Game from "./game.js"

let i = 0

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
    if (collidingObject && (collidingObject.collisionTags.includes("world") || collidingObject.collisionTags.includes("forest"))) {
      const pen = calculatePenetration(gameObject, collidingObject)
      if (Math.abs(pen.x) <= Math.abs(pen.y)) {
        gameObject.x = gameObject.x - pen.x
      } else {
        gameObject.y = gameObject.y - pen.y
      }
    }

    // Wenn das kollidierende Objekt aus Pickups ist, wird es entfernt.
    if (collidingObject && collidingObject.collisionTags.includes("pickups")) {
      collidingObject.destroy()
      Game.money.increaseMoney(10)
    }

    if (collidingObject && collidingObject.collisionTags.includes("forest") && event.key === "f") {
      let countdownDuration = 3;
      const countdownInterval = setInterval(() => {
        countdownDuration--;
        if (countdownDuration <= 0) {
          clearInterval(countdownInterval);
          collidingObject.destroy();
          Game.money.increaseMoney(20);
          this.updateMoney();
        }
      }, 1000);
    }

    if (collidingObject && collidingObject.collisionTags.includes("cave")) {
      if (Game.worldNumber === 1) {
        Game.loadMap("maps/map-02.txt");
        Game.worldNumber = 2;
      } else if (Game.worldNumber === 2) {
        Game.loadMap("maps/map-01.txt");
        Game.worldNumber = 1;
      }
    }
    
    if(collidingObject.collisionTags.includes("enemy")){

      Game.health.attack(10)
      if(Game.health <= 0){

        Game.health.die()
      }
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