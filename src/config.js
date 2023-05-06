import Game from "./game.js"
import { ShootingStone } from "./game_objects.js"

const config = {
  "keys": {
    "KeyW": function() { Game.player.move("up")},
    "KeyA": function() { Game.player.move("left")},
    "KeyS": function() { Game.player.move("down")},
    "KeyD": function() { Game.player.move("right")},
    "Space": {
      callback: function() { new ShootingStone(Game.player.x / Game.tileWidth, Game.player.y / Game.tileHeight)},
      cooldown: 60 // Add cooldown in frames
    }
  }
}

document.addEventListener("keydown", function(event) {
  if (event.code === "KeyP") {
    if (Game.running) {
      Game.pause();
    } else {
      Game.start();
    }
  }
});

export default config;