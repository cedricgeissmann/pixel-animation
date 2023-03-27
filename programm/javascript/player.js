import background from "./script.js"

const playerImage = new Image()
playerImage.src = "./res/player/ACharDown.png"

image.onload = () => {
    c.drawImage(
      playerImage,
      0,
      0,
      playerImage.width / 4,
      playerImage.height,
      canvas.width / 2 - playerImage.width / 4 / 2,
      canvas.height / 2 - playerImage.height / 2,
      playerImage.width / 4,
      playerImage.height
    )
  }