import {EnemySlimeImage} from "../javascript/script.js"
import {attacks} from "../javascript/attacks.js"


const BattleSlimeImage = new Image()
BattleSlimeImage.src = '../res/battle/battleslime-white.png'


export const monsters = {
    Slime2: {
    position: {
      x: 750,
      y: 50
    },
    image: EnemySlimeImage,
    frames: {
      max: 6,
      hold: 15
    },
    animate: true,
    isEnemy: true,
    name: "slime 2",
    attacks: [attacks.Feint, attacks.Tackle, attacks.Fireball]},
  
 
    Slime1: {
    position: {
      x: 250,
      y: 250
    },
    image: BattleSlimeImage,
    frames: {
      max: 6,
      hold: 15
    },
    animate: true,
    name: "slime 1",
    attacks: [attacks.Tackle, attacks.Fireball]
  }}