import {attacks} from "../javascript/attacks.js"
import {Sprite} from "../javascript/classes.js"
import {Monster} from "../javascript/classes.js"
import {monsters} from "../javascript/monsters.js"




const battleBackgroundImage = new Image()
battleBackgroundImage.src = '../res/battle/battlebackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

const EnemySlime = new Monster(monsters.Slime2)
const BattleSlime = new Monster(monsters.Slime1)

const renderedSprites = [EnemySlime, BattleSlime]

BattleSlime.attacks.forEach((attack) => {
  const button = document.createElement('button')
  button.innerHTML = attack.name
  document.querySelector('#attacksBox').append(button)

})


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

    if (EnemySlime.health <= 0) {
      queue.push(() => {
        EnemySlime.faint()
      })
    }

    //enemy attacks right here

    const randomAttack =
    EnemySlime.attacks[Math.floor(Math.random() * EnemySlime.attacks.length)]
  
      queue.push(() => {
        EnemySlime.attack({
          attack: randomAttack,
          recipient: BattleSlime,
          renderedSprites
        })
        if (BattleSlime.health <= 0) {
          queue.push(() => {
            BattleSlime.faint()
          })
        }
      })
    })

    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      document.querySelector('#attackType').innerHTML = selectedAttack.type
      document.querySelector('#attackType').style.color = selectedAttack.color
    
    })
  })
  
  document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
      queue[0]()
      queue.shift()
    } else e.currentTarget.style.display = 'none'
  })
  

  

//animate()