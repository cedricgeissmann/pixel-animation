import Game from "./game.js"
import { ShootingStone } from "./game_objects.js"

const config = {
  "keys": {
    "KeyA": function() { Game.player.move("left")},
    "KeyS": function() { Game.player.move("down")},
    "KeyD": function() { Game.player.move("right")},
    "ArrowUp": function() { Game.player2.move("up")},
    "ArrowLeft": function() { Game.player2.move("left")},
    "ArrowDown": function() { Game.player2.move("down")},
    "ArrowRight": function() { Game.player2.move("right")},
    "Space": {
      callback: function() {
        Game.player.jump()  
        // new ShootingStone(Game.player.x / Game.tileWidth, Game.player.y / Game.tileHeight)
      },
      //cooldown: 60 // Add cooldown in frames
    }
  }
}

export default config;