import { Background, Baumstumpf, Flower, Hoehle, Pilz, Stone, Tree, Wand } from "./game_objects.js"


export default class Map {
  constructor(mapFile) {
    this.tiles = []
    this._readMapFile(mapFile)
  }

  addTilesToMap(x, y, tileType) {
    // TODO:
    // Implementiere das erstellen von neuen Kartenkacheln hier
    // x und y sind die Positionen in der Kartendatei
    // tileType ist der Buchstabe der an dieser Stelle in der Kartendatei steht
    // this.tiles ist eine noch leere Liste, welche alle neuen Kacheln aufnimmt

    // Die Hintergrundkachel wird immer hinzugefügt!!! Andere Kacheln können dann
    // darauf plaziert werden.
    this.tiles.push( new Background(x, y) )
    if ( tileType === "s" ) { this.tiles.push( new Stone(x, y)) }
    else if (tileType === "t" ) { this.tiles.push(new Tree(x, y)) }
    else if ( tileType === "b") {this.tiles.push(new Baumstumpf(x, y))}
    else if ( tileType === "h") {this.tiles.push(new Hoehle(x, y))}
    else if ( tileType === "p") {this.tiles.push(new Pilz(x, y))}
    else if ( tileType === "w") {this.tiles.push(new Wand(x, y))}
    else if ( tileType === "f") {this.tiles.push(new Flower(x, y))}
  }

  drawMap(ctx) {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].draw(ctx)
    }
  }

  _readMapFile(filename) {
    fetch(filename)
      .then((res) => res.text())
      .then((data) => {
        let rows = data.split("\n")
        for (let y = 0; y < rows.length; y++) {
          let row = rows[y].split("")
          for (let x = 0; x < row.length; x++) {
            this.addTilesToMap(x, y, row[x])
          }
        }
      })
  }
}

