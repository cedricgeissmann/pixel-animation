import {attacks} from "../javascript/attacks.js"
import {EnemySlimeImage} from "../javascript/script.js"
import {Sprite} from "../javascript/classes.js"


const battleBackgroundImage = new Image()
battleBackgroundImage.src = '../res/battle/battlebackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})


const EnemySlime = new Sprite({
  position: {
    x: 750,
    y: 50
  },
  image: EnemySlimeImage,
  frames: {
    max: 6,
    hold: 30
  },
  animate: true,
  isEnemy: true,
  name: "slime 2"
})

const BattleSlimeImage = new Image()
BattleSlimeImage.src = '../res/battle/battleslime-white.png'
const BattleSlime = new Sprite({
  position: {
    x: 250,
    y: 250
  },
  image: BattleSlimeImage,
  frames: {
    max: 6,
    hold: 30
  },
  animate: true,
  name: "slime 1"
})

const renderedSprites = [BattleSlime, EnemySlime]
function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  console.log('animating battle')
  battleBackground.draw()
  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}

animateBattle()
const queue = []

// our event listeners for our buttons (attack)
document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', (e) => {
  const selectedAttack = attacks[e.currentTarget.innerHTML]
    BattleSlime.attack({
      attack: selectedAttack,
      recipient: EnemySlime,
      renderedSprites
      
    })

        queue.push(() => {
        EnemySlime.attack({
          attack: attacks.Tackle,
          recipient: BattleSlime,
          renderedSprites
        })
      })
  
      queue.push(() => {
        EnemySlime.attack({
          attack: attacks.Fireball,
          recipient: BattleSlime,
          renderedSprites
        })
      })
    })
  })
  
  document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
      queue[0]()
      queue.shift()
    } else e.currentTarget.style.display = 'none'
  })
  

  

//animate()