import Game from "./game.js"

export function pixelToWorld(x, y) {
    return {
        x: parseInt(x / Game.tileWidth),
        y: parseInt(y / Game.tileHeight),
        overflowX: x % Game.tileWidth > 0,
        overflowY: y % Game.tileHeight > 0,
    }
}


export function findAndRemoveFromList(list, element) {
    var index = list.indexOf(element);
    if (index > -1) {
        list.splice(index, 1);
    } else {
        console.log("Element not found");
    }
}