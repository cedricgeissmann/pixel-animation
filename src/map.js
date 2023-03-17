import { Background,Sand,Water, Air } from "./game_objects.js"


export default class Map {
  constructor(mapFile) {
    this.tiles = []
    this._readMapFile(mapFile)
  }

  addTilesToMap(x, y, tileType) {
  
    this.tiles.push( new Background(x, y) )
    if ( tileType === "b" ) { this.tiles.push( new Background(x, y)) }
    if ( tileType === "s" ) { this.tiles.push( new Sand(x, y)) }
    if ( tileType === "w" ) { this.tiles.push( new Water(x, y)) } 
    if ( tileType === "a" ) { this.tiles.push( new Air(x, y)) }
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

