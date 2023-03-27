const canvas = document.querySelector("#map")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillStyle = "white"
c.fillRect(0, 0, canvas.width, canvas.height)



const image = new Image()
//image.src = "current map file"


class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position
    this.image = image
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

export const background = new Sprite({
  position: {
    x: -785,
    y: -650
  },
  image: image
})
