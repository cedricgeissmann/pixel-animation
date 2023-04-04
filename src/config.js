import Game from "./game.js"

const config = {
  "keys": {
    "KeyW": function() { Game.player.move("up")},
    "KeyA": function() { Game.player.move("left")},
    "KeyS": function() { Game.player.move("down")},
    "KeyD": function() { Game.player.move("right")},
    "Space": function() { Game.player.attack()},
    "Enter": function() { Game.player2.attack()},
    "KeyI": function() { Game.player2.move("up")},
    "KeyJ": function() { Game.player2.move("left")},
    "KeyK": function() { Game.player2.move("down")},
    "KeyL": function() { Game.player2.move("right")},
  }
}

export default config;