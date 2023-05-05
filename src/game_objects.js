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


export class Weapons {
  constructor(weapon,dmg, shield){
    this.damage = dmg
    this.shield = shield
    this.weapon = weapon
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

  handle(ev) {
    if (ev === "KeyW") { this.move("up") }
    if (ev === "KeyS") { this.move("down") }
    if (ev === "KeyA") { this.move("left") }
    if (ev === "KeyD") { this.move("right") }
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
      this.row = 2}
  }
}
export class HealthBar {
  constructor() {
    this.healthPoints = document.querySelector('.health-points');
    this.health = 100;
    this.updateHealthPoints();
    
    this.potionCounter = document.querySelector('.potion-counter');
    this.potions = 3;
    this.updatePotionCounter();

    this.HealingCounter = document.querySelector('.healing-counter')
    this.Healing = 6
    this.updateHealingCounter()
    
    this.SprintsCounter = document.querySelector('.sprints-counter')
    this.Sprints = 10
    this.updateSprintsCounter()

  }

  attack() {
    this.health -= 5;
    this.updateHealthPoints();
  }
  sprint() {
    if(this.Sprints > 0) {
      this.Sprints -= 1
      Game.player.speed = 10
      setTimeout(function() {
        collidingObject.speed = 5; 
      }, 4000);
  
      this.updateSprintsCounter()
    }
  }
  
  


  heal() {
    if(this.Healing > 0 && Game.money.money > 10) {
      this.health += 10;
      this.Healing -= 1
      Game.money.decreaseMoney(5)
      this.updateHealingCounter()
      this.updateHealthPoints();
      Game.money.updateMoney()
    }
  }
  
  potion() {
    if (this.potions > 0 && Game.money.money >= 300) {
      this.health += 50;
      this.potions -= 1;
      Game.money.decreaseMoney(300);
      this.updateHealthPoints();
      this.updatePotionCounter();
      Game.money.updateMoney(); // update the money display
    }
  }

  updateHealthPoints() {
    this.healthPoints.textContent = this.health;
  }
  
  updatePotionCounter() {
    this.potionCounter.textContent = `Potions ${this.potions}`;
    const potionContainer = document.querySelector('.potion-container');
    if (this.potions === 0) {
      potionContainer.style.display = 'none';
    }
  }
  

  updateHealingCounter() {
    this.HealingCounter.textContent = `Healing ${this.Healing}`;
    const healingContainer = document.querySelector('.healing-container');
    if (this.Healing === 0) {
      healingContainer.style.display = 'none';
    }
  }

  updateSprintsCounter() {
    this.SprintsCounter.textContent = `Sprints ${this.Sprints}`;
    const SprintsContainer = document.querySelector('.sprints-container');
    if (this.Sprints === 0) {
      SprintsContainer.style.display = 'none';
    }
  }
  


  Gewonnen() {
    // Stop the game
    Game.running = false;

    // Turn the screen black
    document.body.style.backgroundColor = 'black';

    // Create a container for the message
    const container = document.createElement('div');
    container.style.border = '4px solid transparent';
    container.style.borderRadius = '10px';
    container.style.padding = '20px';
    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.animation = 'zoomIn 0.5s';
    container.style.transition = 'border-color 0.5s ease';

    // Display "You won" message inside the container
    const message = document.createElement('div');
    message.textContent = 'You won';
    message.style.color = 'white';
    message.style.fontSize = '4rem';
    message.style.textAlign = 'center';
    container.appendChild(message);

    // Display "Well done" text beneath the message
    const restartText = document.createElement('div');
    restartText.textContent = 'Well done';
    restartText.style.color = 'white';
    restartText.style.fontSize = '1.5rem';
    restartText.style.textAlign = 'center';
    restartText.style.marginTop = '1rem';
    container.appendChild(restartText);

    // Add the container to the document body
    document.body.appendChild(container);

    // Transition the border color to white
    setTimeout(() => {
      container.style.borderColor = 'white';
    }, 250); // half the duration of the animation
  }

  
  
  die() {
    // Stop the game
    Game.running = false;
    
    // Turn the screen black
    document.body.style.backgroundColor = 'black';
    
    // Create a container for the message
    const container = document.createElement('div');
    container.style.border = '4px solid transparent';
    container.style.borderRadius = '10px';
    container.style.padding = '20px';
    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.animation = 'zoomIn 0.5s';
    container.style.transition = 'border-color 0.5s ease';
    
    // Display "You died" message inside the container
    const message = document.createElement('div');
    message.textContent = 'You died';
    message.style.color = 'white';
    message.style.fontSize = '4rem';
    message.style.textAlign = 'center';
    container.appendChild(message);
    
    // Display "Press R to restart" text beneath the message
    const restartText = document.createElement('div');
    restartText.textContent = 'Press R to restart';
    restartText.style.color = 'white';
    restartText.style.fontSize = '1.5rem';
    restartText.style.textAlign = 'center';
    restartText.style.marginTop = '1rem';
    container.appendChild(restartText);
    
    // Add the container to the document body
    document.body.appendChild(container);
    
    // Transition the border color to white
    setTimeout(() => {
      container.style.borderColor = 'white';
    }, 250); // half the duration of the animation
  }
}

export const healthBar = new HealthBar();


//Die Variabel healthbar soll gleich eine neue Healthbar sein
let Enemyhealth = 100

export function Enemyattack() {
  Enemyhealth -= 5
}

function specialAttack()  {
  Game.health.attack(10)
    Enemyhealth -= 40
    Game.money.decreaseMoney(20)
    Game.money.updateMoney()
  }





document.addEventListener('keydown', event => {
  if (event.key === 'e') {
    console.log(Enemyhealth)
    Enemyattack()
    if (Enemyhealth <= -5) {  
      Game.health.Gewonnen();
    }
  } else if (event.key === 'h') {
    Game.health.heal();
  } else if (event.key === 'p') {
    Game.health.potion();
  } else if (event.key === 'k') {
    Game.health.die();
  } else if (event.key === 'r') {
    location.reload();
  } else if (event.key === 'q') {
    specialAttack();
    if (Enemyhealth <= 0) {
      Game.health.Gewonnen();
    }
  }
    else if (event.key === 'f') {
    Game.speed = 10;
      setTimeout(function() {
        Game.speed = 5; 
      }, 4000);
    }
  }); //Sprint versuch, geschwindigkeit höher





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




export const moneySystem = new MoneySystem(300);
//Die neue variabel moneySystem soll ein neues Geldsystem mit der Menge null sein

export class Enemy extends AnimatedGameObject {
  constructor(x, y) {
    const img = document.querySelector("#character");
    super(x, y, {
      sheet: img,
      layer: "player",
      collisionTags: ["world", "enemy"],
    });
    // Define the Enemy object
    this.Enemyhealth = 20
    this.row = 0;
    this.col = 1;
    this.speed = 5;
    this.handlers = new HandlerManager([
      new EventHandler(),
      new CollisionHandler(),
      new AnimationHandler({ framesPerAnimation: 15, numberOfFrames: 3 }),
    ]);
  }

  update() {
    super.update();{
      if (Game.player.x < this.x) {
        this.move("left");
      }
      if (Game.player.x > this.x) {
        this.move("right");
      }
      if (Game.player.y > this.y) {
        this.move("down");
      }
      if (Game.player.y < this.y) {
        this.move("up");
      }
    }
  }

  move(dir) {
    if (dir === "up") {
      this.dy = this.dy + -1 * this.speed;
      this.row = 3;
    } else if (dir === "down") {
      this.dy = this.dy + 1 * this.speed;
      this.row = 0;
    } else if (dir === "left") {
      this.dx = this.dx + -1 * this.speed;
      this.row = 1;
    } else if (dir === "right") {
      this.dx = this.dx + 1 * this.speed;
      this.row = 2;
    }
  }
}

