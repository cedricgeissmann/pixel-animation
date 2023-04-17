import Game from "./game.js"
<<<<<<< HEAD
import { Background, FallingStone, Flower, Hole, Mushroom, Player, Player2, Stone, Tree, Trunk, Wall } from "./game_objects.js"
=======
import { Background, Mushroom, Player, Stone, Tree, Wall, Cave } from "./game_objects.js"
>>>>>>> upstream/main

/**
 * Diese Klasse liest eine Kartendatei und erstellt die Spiel-Objekte
 * an den Stellen die in der Karte angegeben sind.
 */
export default class Map {
  static width = 0
  static height = 0

  constructor(mapFile) {
    Map.width = 0
    Map.height = 0
    this._readMapFile(mapFile)
    if (mapFile === "maps/map-01.txt") {
      Game.level = 1
    }
    if (mapFile === "maps/map-02.txt") {
      Game.level = 2
    }
    if (mapFile === "maps/map-03.txt") {
      Game.level = 3
    }
    if (mapFile === "maps/map-04.txt") {
      Game.level = 4
    }
  }

  /**
   * Erstelle neue Spiel-Objekte an den jeweiligen Stellen.
   * @param {number} x Die x-Koordinate, an der die Spiel-Objekte erstellt werden.
   * @param {number} y Die y-Koordinate, an der die Spiel-Objekte erstellt werden.
   * @param {string} tileType Der Buchstabe an der Stelle in der Karte.
   */
  addTilesToMap(x, y, tileType) {
    if ( tileType === "s" ) { new Stone(x, y) }
    if ( tileType === "t" ) { new Tree(x, y) }
    if ( tileType === "p" ) { new Mushroom(x, y) }
    if ( tileType === "w" ) { new Wall(x, y) }
    if ( tileType === "U" ) { Game.player = new Player(x, y)}
    if ( tileType === "M" ) { Game.player2 = new Player2(x, y)}
    if ( tileType === "f" ) { new Flower(x, y) }
    if ( tileType === "k" ) { new Trunk(x, y) }
    if ( tileType === "h" ) { new Hole(x, y, 1) }
    if ( tileType === "H" ) { new Hole(x, y, 2) }
  }

  /**
   * Liest die Karte aus der Datei und ruft die Erstellung der Spiel-Objekte auf.
   */
  _readMapFile(filename) {
    fetch(filename)
      .then((res) => res.text())
      .then((data) => {
        let rows = data.split("\n")
        for (let y = 0; y < rows.length; y++) {
          let row = rows[y].split("")
          for (let x = 0; x < row.length; x++) {
            this.addTilesToMap(x, y, row[x])
            Map.width = Math.max(Map.width, x)
            Map.height = Math.max(Map.height, y)
          }
        }
      })
  }
}

