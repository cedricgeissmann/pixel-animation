window.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 576;
 
    const c = canvas.getContext("2d");
    c.fillRect(0, 0, canvas.width, canvas.height);
  
    const player = new Sprite({
      x: 0,
      y: 0
    });
  
    console.log(player);
    console.log("Hallo");
  };