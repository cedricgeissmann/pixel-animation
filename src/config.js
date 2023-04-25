import Game from "./game.js"

const config = {
  "keys": {
    "KeyW": function() { Game.player.move("up")},
    "KeyA": function() { Game.player.move("left")},
    "KeyS": function() { Game.player.move("down")},
    "KeyD": function() { Game.player.move("right")},
    "Space": function() { Game.player.jump()},
    "KeyZ": function() {Game.player.move()},
    "KeyE": function() {Game.player.attack()},
  }
}

export default config;