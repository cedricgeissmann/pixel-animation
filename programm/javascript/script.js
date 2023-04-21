//Main programming file of the game:

//imports
import {collisions} from "../data/collisions 1.js"
import {collisionsB1} from "../data/battlezones/map 1/battlezone 1.js"
import {collisionsB2} from "../data/battlezones/map 1/battlezone 2.js"
import {collisionsB3} from "../data/battlezones/map 1/battlezone 3.js"
import {Boundary} from "../javascript/classes.js"
import {Sprite} from "../javascript/classes.js"

//create const c
const canvas = document.querySelector('canvas')
export const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

//create const collisionsMap
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

//create const battlezones1Map
const battlezones1Map = []
for (let i = 0; i < collisionsB1.length; i += 70) {
  battlezones1Map.push(collisionsB1.slice(i, 70 + i))
}

const battlezones2Map = []
for (let i = 0; i < collisionsB2.length; i += 70) {
  battlezones2Map.push(collisionsB2.slice(i, 70 + i))
}

const battlezones3Map = []
for (let i = 0; i < collisionsB3.length; i += 70) {
  battlezones3Map.push(collisionsB3.slice(i, 70 + i))
}

//create const boundaries
const boundaries = []
//create const offset
const offset = {
  x: -735,
  y: -650
}

//loading collisions
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})


//create const battle1zones
const battle1zones = []

//load battlezone
battlezones1Map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battle1zones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

console.log (battle1zones)


const battle2zones = []

battlezones2Map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battle2zones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

console.log (battle2zones)

const battle3zones = []

battlezones3Map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battle3zones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

console.log (battle3zones)



//image sources
const image = new Image()
image.src = '../res/maps/mapzoom.png'

const playerDownImage = new Image()
playerDownImage.src = '../res/player/ACharDown.png'

const playerUpImage = new Image()
playerUpImage.src = '../res/player/ACharUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = '../res/player/ACharLeft.png'

const playerRightImage = new Image()
playerRightImage.src = '../res/player/ACharRight.png'

const foregroundImage = new Image()
foregroundImage.src = '../res/foreground objects/foreground.png'

const SlimeBlueImage = new Image()
SlimeBlueImage.src = '../res/slimes/slime-blue.png'

const Slime2BlueImage = new Image()
Slime2BlueImage.src = '../res/slimes/slime-blue.png'

const SlimeGreenImage = new Image()
SlimeGreenImage.src = '../res/slimes/slimes-green.png'

const Slime2GreenImage = new Image()
Slime2GreenImage.src = '../res/slimes/slimes-green.png'

const SlimePinkImage = new Image()
SlimePinkImage.src = '../res/slimes/slimes-pink.png'

const Slime2PinkImage = new Image()
Slime2PinkImage.src = '../res/slimes/slimes-pink.png'




//create const player
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  frames: {
    max: 4
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})
console.log(player)


const SlimeBlue = new Sprite({
  position: {
    x: 129,
    y: 214,
  },
  image: SlimeBlueImage,
  frames: {
    max: 6
  },
})

const Slime2Blue = new Sprite({
  position: {
    x: 1185,
    y: 646,
  },
  image: Slime2BlueImage,
  frames: {
    max: 6
  },
})

const SlimeGreen = new Sprite({
  position: {
    x: 1665,
    y: 22,
  },
  image: SlimeGreenImage,
  frames: {
    max: 6
  },
})

const Slime2Green = new Sprite({
  position: {
    x: 705,
    y: 550,
  },
  image: Slime2GreenImage,
  frames: {
    max: 6
  },
})

const SlimePink = new Sprite({
  position: {
    x: 1665,
    y: 22,
  },
  image: SlimePinkImage,
  frames: {
    max: 6
  },
})

const Slime2Pink = new Sprite({
  position: {
    x: 705,
    y: 550,
  },
  image: Slime2PinkImage,
  frames: {
    max: 6
  },
})

//create const background
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
})



//create const keys
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

//create const movables (all moving elements)
const movables = [background, ...boundaries, foreground, ...battle1zones, ...battle2zones, ...battle3zones, SlimeBlue, Slime2Blue, SlimeGreen
, Slime2Green, SlimePink, Slime2Pink,]

//collision-detector
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

//create const battle
const battle = {
  initiated: false
}

//animate function
function animate() {
  const animationId = window.requestAnimationFrame(animate)
//draw()
  background.draw()
  SlimeBlue.draw()
  Slime2Blue.draw()
  SlimeGreen.draw()
  Slime2Green.draw()
  SlimePink.draw()
  Slime2Pink.draw()
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  battle1zones.forEach((boundary) => {
    boundary.draw()
  })
  battle2zones.forEach((boundary) => {
    boundary.draw()
  })
  battle3zones.forEach((boundary) => {
    boundary.draw()
  })

  
  player.draw()
  foreground.draw()
  
  

  let moving = true
  player.moving = false
  SlimeBlue.moving = true
  Slime2Blue.moving = true
  SlimeGreen.moving = true
  Slime2Green.moving = true
  SlimePink.moving = true
  Slime2Pink.moving = true


  
  if (battle.initiated) return

  
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
  for (let i = 0; i < battle1zones.length; i++) {

  //create const battle1zone
  const battle1zone = battle1zones[i]

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: battle1zone
    })){
      //battle activation
      console.log('activate battle')
      window.cancelAnimationFrame(animationId)
        battle.initiated = true

        gsap.to('#overlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to('#overlappingDiv', {
              opacity: 1,
              duration: 0.4
            })

            // activate a new animation loop
            animateBattle()
          }
        })

        break
    }}}

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
      for (let i = 0; i < battle2zones.length; i++) {
    
      //create const battle1zone
      const battle2zone = battle2zones[i]
    
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battle2zone
        })){
          //battle activation
          console.log('activate battle')
          window.cancelAnimationFrame(animationId)
            battle.initiated = true
    
            gsap.to('#overlappingDiv', {
              opacity: 1,
              repeat: 3,
              yoyo: true,
              duration: 0.4,
              onComplete() {
                gsap.to('#overlappingDiv', {
                  opacity: 1,
                  duration: 0.4
                })
    
                // activate a new animation loop
                animateBattle()
              }
            })
    
            break
        }}}

        if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
          for (let i = 0; i < battle3zones.length; i++) {
        
          //create const battle1zone
          const battle3zone = battle3zones[i]
        
          if (
            rectangularCollision({
              rectangle1: player,
              rectangle2: battle3zone
            })){
              //battle activation
              console.log('activate battle')
              window.cancelAnimationFrame(animationId)
                battle.initiated = true
        
                gsap.to('#overlappingDiv', {
                  opacity: 1,
                  repeat: 3,
                  yoyo: true,
                  duration: 0.4,
                  onComplete() {
                    gsap.to('#overlappingDiv', {
                      opacity: 1,
                      duration: 0.4
                    })
        
                    // activate a new animation loop
                    animateBattle()
                  }
                })
        
                break
            }}}


  //player movement by w,a,s,d
  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    player.image = player.sprites.up

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    player.image = player.sprites.left

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    player.image = player.sprites.down

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
  }
}
//battle-animation
animate()

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  console.log('animating battle')
}

//create let lastKey and activate keys by "keydown" event
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

//disable keys by "keyup" event
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
