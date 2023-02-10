import { Player } from "./game_objects.js"
import Map from "./map.js"
import CollisionDetector from "./collision_detector.js"
import Camera from "./camera.js"



export default class Game {

  static CD = new CollisionDetector()
  static map = new Map("maps/map.txt")

  constructor() {
    this.tileSize = 32
    this.canvas = document.querySelector("#canvas")
    this.canvas.width = 10 * this.tileSize
    this.canvas.height = 15 * this.tileSize
    this.ctx = this.canvas.getContext("2d")
    this.ctx.imageSmoothingEnabled = false

    this.player = new Player(4, 5)
    this.camera = new Camera(this)

    this.camera.moveToPoint(-1, 2, this.player.tileSize, 60)
  }

  gameLoop() {
    
    this.camera.clearScreen()
    this.camera.nextFrame()

    this.player.update()
    Game.CD.checkCollision("all")

    this.camera.centerObject(this.player)
    //this.camera.offset = {x: -1, y: 0}

    Game.map.drawMap(this.ctx)
    this.player.draw(this.ctx)
  }
}