import Game from "./game.js"

function animationLoop() {
  game.gameLoop()

  window.requestAnimationFrame(animationLoop)
}

let game = new Game()
window.requestAnimationFrame(animationLoop)
