import Map from "./map.js"
import CollisionDetector from "./collision_detector.js"
import Camera from "./camera.js"
import TileRegistry from "./tile_registry.js"
import EventHandler from "./event_handler.js"


/**
 * Diese Klasse enthält die globalen Variablen für das Spiel,
 * sowie das GameLoop, welches das Spiel zeichnen soll.
 */
export default class Game {

  static map = null;
  static player = null;
  static player2 = null;
  static running = false;
  static currentFrame = 0;
  static canvas = document.querySelector("#canvas")
  static tileWidth = 32
  static tileHeight = 32
  static instance = null

  static allApples = false

  constructor() {
    Game.instance = this
    Game.canvas.width = 10 * Game.tileWidth
    Game.canvas.height = 15 * Game.tileHeight
    this.ctx = Game.canvas.getContext("2d")
    this.ctx.imageSmoothingEnabled = false

    new EventHandler()

    Game.loadMap("maps/map-01.txt")

    this.camera = new Camera(this)

    document.querySelector("#game-start").addEventListener("click", () => { Game.start() })
    document.querySelector("#game-pause").addEventListener("click", () => { Game.pause() })

    Game.running = false
    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  /**
   * Startet das Spiel.
   * 
   * Das Spiel wird gestartet indem die Animationsschleife
   * des Spiels aufgerufen wird.
   */
  static start() {
    Game.running = true
    document.querySelector("body").classList.remove("paused")
    window.requestAnimationFrame(Game.instance.gameLoop.bind(Game.instance))
  }

  /**
   * Pausiert das Spiel.
   * 
   * Die Animationsschleife des Spiels wird unterbrochen,
   * dadurch wird das Spiel pausiert.
   * 
   * Um das Spiel weiterlaufen zu lassen, muss die Methode 
   * `start()` aufgerufen werden.
   */
  static pause() {
    document.querySelector("body").classList.add("paused")
    Game.running = false
  }

  static loadMap(mapfile) {
      TileRegistry.clear()
      CollisionDetector.clear()
      Game.player = null
      Game.map = new Map(mapfile)

  }

  static checkNewMap() {
    if (Game.allApfel === true &&
        Game.allCupcake === true &&
        Game.allLachssushi === true &&
        Game.allGelbsushi === true &&
        Game.allKristall === true &&
        Game.allRubin === true &&
        Game.allMushroompurple === true && true) {
        Game.loadMap("maps/maparena.txt")
      }
  }

 static updateApfel(value) 
{ const elem = document.querySelector("#apfel-counter")
 let count = parseInt (elem.textContent)
 count = count + value
  elem.textContent = `${count} / 6`
  if (count >= 6) { Game.allApfel = true}
  Game.checkNewMap()
 }

 static updateCupcake(value) 
 { const elem = document.querySelector("#cupcake-counter")
  let count = parseInt (elem.textContent)
  count = count + value
  elem.textContent = `${count} / 4`
  if (count >= 4) { Game.allCupcake = true}
  Game.checkNewMap()
  }

  static updateLachssushi(value) 
  { const elem = document.querySelector("#lachssushi-counter")
   let count = parseInt (elem.textContent)
   count = count + value
  elem.textContent = `${count} / 2`
  if (count >= 2) { Game.allLachssushi = true}
  Game.checkNewMap()
  }
   static updateGelbsushi(value) 
  { const elem = document.querySelector("#gelbsushi-counter")
   let count = parseInt (elem.textContent)
   count = count + value
   elem.textContent = `${count} / 2`
   if (count >= 2) { Game.allGelbsushi = true}
   Game.checkNewMap()
   }

   static updateMushroompurple(value) 
  { const elem = document.querySelector("#mushroompurple-counter")
   let count = parseInt (elem.textContent)
   count = count + value
   elem.textContent = `${count} / 6`
   if (count >= 6) { Game.allMushroompurple = true}
   Game.checkNewMap()
   }


   static updateRubin(value) 
   { const elem = document.querySelector("#rubin-counter")
    let count = parseInt (elem.textContent)
    count = count + value
  elem.textContent = `${count} / 4`
  if (count >= 4) { Game.allRubin = true}
  Game.checkNewMap()
  }

    static updateKristall(value) 
   { const elem = document.querySelector("#kristall-counter")
    let count = parseInt (elem.textContent)
    count = count + value
  elem.textContent = `${count} / 4`
  if (count >= 4) { Game.allKristall = true}
  Game.checkNewMap()
  }

    static updateBlume(value) 
    { const elem = document.querySelector("#blume-counter")
     let count = parseInt (elem.textContent)
      elem.textContent = `${count + value} / 10`
     }

     static updateCrown(value) 
     { const elem = document.querySelector("#crown-counter")
      let count = parseInt (elem.textContent)
       elem.textContent = `${count + value} / 1`
       Game.checkMapImage()
      }

static checkMapImage() {
  if(parseInt(document.querySelector("#crown-counter").textContent) === 1
    && parseInt(document.querySelector ("#blume-counter").textContent) >= 10){
      Game.loadImage("res/Endimage.png")
    }
    
}

static loadImage(imgfile) {
  const imgElem = document.querySelector("#displayImg")
  imgElem.src = imgfile
  imgElem.style.display = "flex"
}
    
    
  static checkLastMapCondition() {
    if (parseInt(document.querySelector("#kristall-counter").textContent) >= 4
      && parseInt(document.querySelector("#rubin-counter").textContent) >= 4
      && parseInt(document.querySelector("#mushroompurple-counter").textContent) >= 6
      && parseInt(document.querySelector("#gelbsuhsi-counter").textContent) >= 2
      && parseInt(document.querySelector("#lachssuchi-counter").textContent) >= 2
      && parseInt(document.querySelector("#cupcake-counter").textContent) >= 4
       && parseInt(document.querySelector("#apfel-counter").textContent) >= 6) {
       Game.loadMap(maparena.txt)
        }
      
      }
  /**
   * Berechnet jeweils das nächste Frame für das Spiel.
   * Die Positionen der Spiel-Objekte werden neu berechnet,
   * die Kamera wird korrekt ausgerichtet und die 
   * Spiel-Objekte werden neu gezeichnet.
   */
  gameLoop() {

    Game.currentFrame++
    
    CollisionDetector.clearXRay()
    this.camera.clearScreen()
    this.camera.nextFrame()

    EventHandler.handleAllEvents()

    TileRegistry.updateAllTiles()
    CollisionDetector.checkCollision()

    this.camera.centerObject(Game.player)

    TileRegistry.drawAllTiles(this.ctx)

    if (Game.running === true) {
      window.requestAnimationFrame(this.gameLoop.bind(this))
    }
  }
}