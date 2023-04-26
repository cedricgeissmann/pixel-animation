import Game from "./game.js"

const config = {
  "keys": {
    "KeyW": function() { Game.player && Game.player.move("up")},
    "KeyA": function() {Game.player &&  Game.player.move("left")},
    "KeyS": function() {Game.player &&  Game.player.move("down")},
    "KeyD": function() {Game.player &&  Game.player.move("right")},
    "Space": function() { Game.player && Game.player.jump()},
    "KeyZ": function() {Game.player && Game.player.move()},
    "KeyE": function() {Game.player && Game.player.attack()},
    "KeyQ": function() {Game.player && Game.player.suicide()},
  }
}

export default config;