import Game from "./game.js"
import { ShootingStone } from "./game_objects.js"

const config = {
  "keys": {
    "KeyA": function() { Game.player.move("left")},
    "KeyD": function() { Game.player.move("right")},
    "KeyW": function() { Game.player.jump()},
    "ArrowUp": function() { Game.player2.jump()},
    "ArrowLeft": function() { Game.player2.move("left")},
    "ArrowRight": function() { Game.player2.move("right")},
    "KeyF": function() { Game.player.heal()},
    "KeyG": function() { Game.player.move("attack")},
    "KeyM": function() { Game.player2.heal()},
    "KeyN": function() { Game.player2.move("attack")},
    
  }
}

export default config;