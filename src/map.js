import Game from "./game.js"
import { Cowwhite, Pilz, Player, Stone, Tree, Wall, Cave, Tree1, Background1, Zaun, Busch2, Busch1, Wasser, Strand, Strand2, Tree2, Tree3, Blume, Blume2, kleinebüsche, Roteblume, Roterpilz, Erde, Bank1, Bank2, Brunnen1, Brunnen2, Brunnen3, Brunnen4, Apfel, Cupcake, Lachssushi, Gelbsushi, Hedges, Cavefloor, Mushroompurple, Caveentrance, Cavewall, StoneGrey, Lapislazuli, Ruby, Crown, Lblume, Water, Background2,Erdhaufen, Erdhaufen2 } from "./game_objects.js"

/**
 * Diese Klasse liest eine Kartendatei und erstellt die Spiel-Objekte
 * an den Stellen die in der Karte angegeben sind.
 */
export default class Map {
  constructor(mapFile) {
    this.mapfile = mapFile
    this._readMapFile(mapFile)
  }

  /**
   * Erstelle neue Spiel-Objekte an den jeweiligen Stellen.
   * @param {number} x Die x-Koordinate, an der die Spiel-Objekte erstellt werden.
   * @param {number} y Die y-Koordinate, an der die Spiel-Objekte erstellt werden.
   * @param {string} tileType Der Buchstabe an der Stelle in der Karte.
   */
  addTilesToMap(x, y, tileType) {
    if (this.mapfile === "maps/maparena.txt") {
      new Background1(x, y)
      
    } else if (this.mapfile === "maps/map-01.txt") {
      new Background1(x, y)
    } else if (this.mapfile === "maps/map-02.txt"){
      console.log(this.mapfile)
      new Background2(x, y)
    }
    if ( tileType === "s" ) { new Stone(x, y) }
    if ( tileType === "J" ) { new Lblume(x, y) }
    if ( tileType === "c" ) { new Gelbsushi(x, y) }
    if ( tileType === "C" ) { new Lachssushi(x, y) }
    if ( tileType === "l" ) { new Cupcake(x, y) }
    if ( tileType === "L" ) { new Apfel(x, y) }
    if ( tileType === "N" ) { new Brunnen1(x, y) }
    if ( tileType === "n" ) { new Brunnen2(x, y) }
    if ( tileType === "A" ) { new Brunnen3(x, y) }
    if ( tileType === "a" ) { new Brunnen4(x, y) }
    if ( tileType === "E" ) { new Erde(x, y) }
    if ( tileType === "r" ) { new Roterpilz(x, y) }
    if ( tileType === "F" ) { new Blume(x, y) }
    if ( tileType === "f" ) { new Blume2(x, y) }
    if ( tileType === "k" ) { new kleinebüsche(x, y) }
    if ( tileType === "R" ) { new Roteblume(x, y) }
    if ( tileType === "q" ) { new Tree3(x, y) }
    if ( tileType === "d" ) { new Tree2(x, y) }
    if ( tileType === "x" ) { new Bank1(x, y) }
    if ( tileType === "X" ) { new Bank2(x, y) }
    if ( tileType === "v" ) { new Strand2(x, y) }
    if ( tileType === "V" ) { new Strand(x, y) }
    if ( tileType === "W" ) { new Wasser(x, y) }
    if ( tileType === "t" ) { new Tree(x, y) }
    if ( tileType === "p" ) { new Pilz(x, y) }
    if ( tileType === "w" ) { new Wall(x, y) }
    if ( tileType === "h" ) { new Cave(x, y) }
    if ( tileType === "e" ) { new Hedges(x, y) }
    if ( tileType === "P" ) { Game.player = new Player(x, y)}
    if ( tileType === "T" ) { new Tree1(x, y) }
    if ( tileType === "B" ) { new Busch1(x, y) }
    if ( tileType === "Z" ) { new Zaun(x, y) }
    if ( tileType === "b" ) { new Busch2(x, y) }
    if ( tileType === "M" ) { new Mushroompurple(x, y)}
    if ( tileType === "D" ) { new Caveentrance(x, y)}
    if ( tileType === "Y" ) { new Cavewall(x, y)}
    if ( tileType === "G" ) { new StoneGrey(x, y)}
    if ( tileType === "i" ) { new Lapislazuli(x, y)}
    if ( tileType === "j" ) { new Ruby(x, y)}
    if ( tileType === "O" ) { new Crown(x, y)}
    if ( tileType === "Q" ) { new Water(x, y)}
    if ( tileType === "U" ) { new Cowwhite(x, y)}
    if ( tileType === "g" ) { new Erdhaufen (x,y)}
    if ( tileType === "H" ) { new Erdhaufen2 (x,y)}

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
          }
        }
      })
  }
}

