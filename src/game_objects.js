import EventHandler, {AnimationHandler, CollisionHandler, HandlerManager, } from "./event_handler.js"
import { findAndRemoveFromList } from "./utils.js"
import TileRegistry from "./tile_registry.js"
import CollisionDetector from "./collision_detector.js"
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

export class Background extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "background",
      collisionTags: []
    })

    this.row = 0
    this.col = 0
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

export class FallingStone extends Stone {
  constructor(x, y) {
    super(x, y)
    this.handlers = new HandlerManager([
      new GravityHandler({
        maxGravity: 3,
        gravityForce: 1
      }),
      new CollisionHandler()
    ])
  }
  
}

export class Tree extends GameObject {
  constructor(x, y) {
    const ground = document.querySelector("#ground")
    super(x, y, {
      sheet: ground,
      layer: "forest",
      collisionTags: ["world"]
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
      collisionTags: ["world", "pickups", "cave", "forest"]
    })
    this.row = 0
    this.col = 1
    this.speed = 15
    this.handlers = new HandlerManager([
      new EventHandler(),
      new CollisionHandler(),
      new AnimationHandler({ framesPerAnimation: 15, numberOfFrames: 3})
    ])
  }

  

  jump() {
    this.handlers.get(GravityHandler).jump(this)
  }

  update() {
    super.update()
  }

  cutTree() {
    TileRegistry.layers["forest"].forEach((tree) => {
      console.log(tree)
      console.log(tree.x, tree.y, this.x, this.y)
      if(this.x && this.y === tree.x && tree.y +1 )
      {
        tree.destroy()
      }
      
    })
  }

  handle(ev) {
    if (ev === "KeyW") { this.move("up") }
    if (ev === "KeyS") { this.move("down") }
    if (ev === "KeyA") { this.move("left") }
    if (ev === "KeyD") { this.move("right") }
    if (ev === "KeyF") { this.cutTree() }
    if (ev === "ArrowUp"){ this.move("up") }
    if (ev === "ArrowDown"){ this.move("down") }
    if (ev === "ArrowLeft"){ this.move("left") }
    if (ev === "ArrowRight"){ this.move("right") }


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
    } else if (direction === "attack"){
      actionAttack()
    }
  }
}

 export class HealthBar {
  constructor() {
    this.healthPoints = document.querySelector('.health-points');
    this.health = 100;
    this.updateHealthPoints();
    const PotionCounter = 3
  }

  //eine neue Klasse mit einem Konstruktor
  /*Die Gesundheitspunkte seien gleich verbunden mit dem index.html 
  /* Die Gesundheitspunkte seien gleich 100
  /*die Gesundheitspunkte sollen neu geladen werden
  */

  attack() {
    this.health -= 10;
    this.updateHealthPoints();
  }

//funktion angreifen
/*Die Gesundheitspunkte sollen um -10 verringert werden
/* Die Gesundheitspunkte sollen neu geladen werden
*/

  heal() {
    this.health += 10;
    this.updateHealthPoints();
  }

  //funktion heilen
  /*Die Gesundheitspunkte sollen um 10 erhöht werden
  /* Die Gesundheitspunkte sollen neu geladen werden
  */

  updateHealthPoints() {
    this.healthPoints.textContent = this.health;
  }

  potion(){
    this.health += 50
    const PotionCounter = PotionCounter - 1
  }

  die(){
    if(Game.health <= 0){ 
      Game.stop()
    }
  }
  
  //funktion die Gesundheitspunkte sollen neu geladen werden
  /*Die Gesundheitspunkte mit dem Text inhalt, sollen gleich this.health
  */

  
}

export const healthBar = new HealthBar();

//Die Variabel healthbar soll gleich eine neue Healthbar sein

document.addEventListener('keydown', event => {
  if (event.key === 'e') {
    Game.health.attack();
  }  if (event.key === 'h') {
    Game.health.heal();
  }
  if(event.key === 'p'){
    Game.health.potion()
  }
});

//füge eine neue Eventliste hinzu, welche beim Drücken einer Taste ein event ausführen soll
/*wenn Die gedrückte Taste "e" ist, soll es die Aktion attack auf die healthbar ausführen
/* Sonst wenn Die gedrückte Taste "q" ist, soll es die Aktion heilen auf die healthbar ausführen
*/


export class MoneySystem {
  constructor(initialMoney) {
    this.money = initialMoney;
    this.moneyElement = document.querySelector('.money-amount');
    this.updateMoney();
  }
  //constructor mit dem Inhalt initialMoney
  /* neue Variabel this.money sei der INhalt des Konstruktors
  /*this.moneyElement sei gleich money-amount mit einem querySelector um es mit index.html zu verbinden
  /*funktion updateMoney soll aufgerufen werden
  */

  updateMoney() {
    this.moneyElement.textContent = this.money;
  }
  //funktion updateMoney, das Geld soll neu geladen werden
  /*this.moneyElement.textContent sei gleich this.money von oben
  */

  decreaseMoney(amount) {
    this.money -= amount;
    this.updateMoney();
  }
  //funktion geld verringern mit dem Inhalt amount, welches die Menge des Geldes zeigen soll
  /* this.money soll verringert werden mit der eingegebenen Menge
  /* Die Anzeige soll wieder neu geladen werden
  */

  increaseMoney(amount) {
    this.money += amount;
    this.updateMoney();
  }
  //fuktion geld erhöhen mit dem Inhalt amount, welches die Menge des Geldes zeigen soll
  /* this.money soll erhöht werden mit der eingegebenen Menge
  /* Die Anzeige soll wieder neu geladen werden
  */
  
}


export class Weapons {
  constructor(damage, shield){
    this.damage = 5
    this.shield = 0
  } 
}

export const moneySystem = new MoneySystem(0);
//Die neue variabel moneySystem soll ein neues Geldsystem mit der Menge null sein



export class Enemy extends AnimatedGameObject {
  constructor(x, y) {
    const img = document.querySelector("#character")
    super(x, y, {
      sheet: img,
      layer: "player",
      collisionTags: ["world", "enemy"]
    })
    this.health = 20
    this.row = 0
    this.col = 1
    this.speed = 5
    this.lastHit = 0
    this.slowedDown = false  // flag to track if the enemy is slowed down
    this.slowDownStart = 0   // the frame when the enemy started to slow down
    this.handlers = new HandlerManager([
      new EventHandler(),
      new CollisionHandler(),
      new AnimationHandler({ framesPerAnimation: 15, numberOfFrames: 3})
    ])
  }
  update() {
    super.update();
    
    if (Game.currentFrame - this.lastHit > 30 ){
      if (this.slowedDown && Game.currentFrame - this.slowDownStart > 60) {
        // if the enemy has been slowed down for more than 60 frames (1 second),
        // reset its speed and the slowedDown flag
        this.speed = 5;
        this.slowedDown = false;
      }
    
      if (Game.player.x < this.x) {
        this.move("left")
      }
    
      if (Game.player.x > this.x) {
        this.move("right")
      }
    
      if (Game.player.y > this.y){
        this.move("down")
      }
    
      if (Game.player.y < this.y) {
        this.move("up")
      }
    }
  }
  
  move(dir) {
    if (dir === "up") {
      this.dy = this.dy + (-1) * this.speed
      this.row = 3
    } else if (dir === "down") {
      this.dy = this.dy + (1) * this.speed
      this.row = 0
    } else if (dir === "left") {
      this.dx = this.dx + (-1) * this.speed
      this.row = 1
    } else if (dir === "right") {
      this.dx = this.dx + (1) * this.speed
      this.row = 2
    }
  }
  
  onCollision(other) {
    if (other instanceof Player) {
      // if the enemy collides with the player, slow it down and start tracking
      // the slow down period
      this.speed = 2;
      this.slowedDown = true;
      this.slowDownStart = Game.currentFrame;
    }
  }
}
