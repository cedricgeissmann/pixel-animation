




const battleBackgroundImage = new Image()
battleBackgroundImage.src = '../res/battle/battlebackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

let EnemySlime
let BattleSlime
let renderedSprites
let battleAnimationId
let queue

function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()

 EnemySlime = new Monster(monsters.Slime2)
  BattleSlime = new Monster(monsters.Slime1)
  renderedSprites = [EnemySlime, BattleSlime]
  queue = []

BattleSlime.attacks.forEach((attack) => {
  const button = document.createElement('button')
  button.innerHTML = attack.name
  document.querySelector('#attacksBox').append(button)

})


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
      queue.push(() => {
        // fade back to black
        gsap.to('#overlappingDiv', {
          opacity: 1,
          onComplete: () => {
            cancelAnimationFrame(battleAnimationId)
            animate()
            document.querySelector('#userInterface').style.display = 'none'

            gsap.to('#overlappingDiv', {
              opacity: 0
            })

            battle.initiated = false
          }
        })
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
          queue.push(() => {
            // fade back to black
            gsap.to('#overlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#userInterface').style.display = 'none'

                gsap.to('#overlappingDiv', {
                  opacity: 0
                })
                
                battle.initiated = false
              }
            })
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
}
  function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
  
    
  
    renderedSprites.forEach((sprite) => {
      sprite.draw()
    })
  }
  
  // animate()
  initBattle()
  animateBattle()
  
  document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
      queue[0]()
      queue.shift()
    } else e.currentTarget.style.display = 'none'
  })
  

  

//animate()