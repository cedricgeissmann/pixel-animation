const canvas = document.querySelector("#map")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillStyle = "white"
c.fillRect(0, 0, canvas.width, canvas.height)



const image = new Image()
//image.src = "current map file"

image.onload = () => {
  c.drawImage(image, -750, -550)
}
