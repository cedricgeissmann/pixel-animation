export default class CollosionDetector {
    constructor(){
        this.layers = {
            world: [],
            forest: [],
        };
    }

    checkCollision(layer){
        this.layers[layer].forEach(tile => {
            const h1 = new Hitbox(tile);
            this.layers[layer].forEach(other => {
                if (tile === other) {
                    return false
                } else {
                    const h2 = new Hitbox(other);
                    const collision = this.hitboxOverlapping(h1, h2);
                    if (collision) {
                        tile.dispatchEvent(new CustomEvent('collision', {detail: other}));
                    }
                }
            })
        })
    }

    hitboxOverlapping(h1, h2) {
        // TODO: Implementiere Kollisionserkennung
        return false
    }
    
}

export function calculatePenetration(tile, other) {
    const h1 = new Hitbox(tile);
    const h2 = new Hitbox(other);
    // only on the x-Axis
    let c1 = h1.getCenter()
    let c2 = h2.getCenter()

    let x = h1.getRight() - h2.getLeft()
    if (c1.x > c2.x) {
        x = h1.getLeft() - h2.getRight()
    }

    let y = h1.getBottom() - h2.getTop()
    if (c1.y > c2.y) {
        y = h1.getTop() - h2.getBottom()
    }

    return {x: x / h1.tileSize, y: y / h1.tileSize}

}


class Hitbox {
    constructor(tile) {
        this.x = tile.x * tile.tileSize
        this.y = tile.y * tile.tileSize
        this.tileSize = tile.tileSize
    }

    getLeft() {
        return this.x
    }
    getTop() {
        return this.y
    }
    getRight() {
        return this.x + this.tileSize
    }
    getBottom() {
        return this.y + this.tileSize
    }
    getCenter() {
        return {
            x: this.x + this.tileSize / 2,
            y: this.y + this.tileSize / 2,
        }
    }
}
