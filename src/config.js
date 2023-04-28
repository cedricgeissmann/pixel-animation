import Game from "./game.js"
import { ShootingStone } from "./game_objects.js"

const config = {
  "keys": {
    "KeyW": function() { Game.player.move("up")},
    "KeyA": function() { Game.player.move("left")},
    "KeyD": function() { Game.player.move("right")},
    "Space": function() { Game.player.jump()},
    "ArrowUp": function() { Game.player2.move("up")},
    "ArrowLeft": function() { Game.player2.move("left")},
    "ArrowDown": function() { Game.player2.move("down")},
    "ArrowRight": function() { Game.player2.move("right")},
    "KeyF": function() { Game.player.heal()},
    "KeyG": function() { Game.player.move("attack")},
    "KeyM": function() { Game.player2.heal()},
    "KeyN": function() { Game.player2.move("attack")},
    
  }
}

export default config;