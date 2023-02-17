class Player1 extends GameAnimatedObjects {
    constructor(name, hp, dmg) {
        this.name = name
  
        this.statsHp = 20 + hp
        this.statsArmor = 8 
        this.statsDmg = 4 + dmg
        this.statsMana = 100
        
        this.target = null
        
        watchElement(this)
    }
  
    actionAttack() {
        if (this.target == null) {
            errorLog("Es ist kein Ziel definiert.")
        }
        let doDmg = this.statsDmg
  
        if(this.weapon) {
            doDmg = doDmg + this.weapon.dmg
            if(this.weapon.type === "axe") {
                doDmg = doDmg * 2
            }
            if(this.weapon.type === "sword") {
                doDmg = doDmg * 1.5
            }
            if(this.armor.type === "Helmet") {
                doDmg = doDmg * 0.5
            }
            if(this.armor.type === "Foot-Armor") {
                doDmg = doDmg * 0.75
            }
            if(this.armor.type === "Chest-Armor") {
                doDmg = doDmg *0.25
            }
  
        }
        this.target.takeDamage(doDmg)
  
  
    }}