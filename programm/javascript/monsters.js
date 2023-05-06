




const monsters = {
    Slime2: {
    position: {
      x: 750,
      y: 50
    },
    image: {
      src: '../res/battle/battleslime-green.png'
    },
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
    image: {
      src: '../res/battle/battleslime-white.png'
    },
    frames: {
      max: 6,
      hold: 15
    },
    animate: true,
    name: "slime 1",
    attacks: [attacks.Tackle, attacks.Fireball]
  }}