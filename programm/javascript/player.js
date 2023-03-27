import {background} from "./script.js"
import {image} from "./script.js"
import {c} from "./script.js"
import {canvas} from "./script.js"

const playerImage = new Image()
playerImage.src = "../res/player/ACharDown.png"

image.onload = () => {
    c.drawImage(
      playerImage,
      0,
      0,
      playerImage.width / 4,
      playerImage.height,
      canvas.width / 2 - playerImage.width / 4 / 2,
      canvas.height / 2 - playerImage.height / 2,
      playerImage.width / 4,
      playerImage.height
    )
  }

  const keys = {
    w: {
      pressed: false
    },
    a: {
      pressed: false
    },
    s: {
      pressed: false
    },
    d: {
      pressed: false
    }
  }
  
  function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    c.drawImage(
      playerImage,
      0,
      0,
      playerImage.width / 4,
      playerImage.height,
      canvas.width / 2 - playerImage.width / 4 / 2,
      canvas.height / 2 - playerImage.height / 2,
      playerImage.width / 4,
      playerImage.height
    )
  
    if (keys.w.pressed && lastKey === 'w') background.position.y += 3
    else if (keys.a.pressed && lastKey === 'a') background.position.x += 3
    else if (keys.s.pressed && lastKey === 's') background.position.y -= 3
    else if (keys.d.pressed && lastKey === 'd') background.position.x -= 3
  }
  animate()
  
  let lastKey = ''
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = true
        lastKey = 'w'
        break
      case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break
  
      case 's':
        keys.s.pressed = true
        lastKey = 's'
        break
  
      case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break
    }
  })
  
  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break
      case 's':
        keys.s.pressed = false
        break
      case 'd':
        keys.d.pressed = false
        break
    }
  })
  