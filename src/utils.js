export function findAndRemoveFromList(list, element) {
    var index = list.indexOf(element);
    if (index > -1) {
        list.splice(index, 1);
    } else {
        console.log("Element not found");
    }
}
function renderPlayer(obj) {
    const playerElement = document.querySelector(obj.id)
    playerElement.innerHTML = `
          <h2>${obj.name}</h2>
          <p>HP: ${obj.hp}</p>
          <p>Damage: ${obj.dmg}</p>
          <p>Armor: ${obj.armor}</p>
          <button class="attack">Attack</button>
          <button class="heal">Heal</button>
          `
  
      playerElement
        .querySelector(".attack")
        .addEventListener("click", () => obj.attack())
  
      playerElement
        .querySelector(".heal")
        .addEventListener("click", () => obj.heal())
  }
  
  function errorLog(msg) {
      const err = document.querySelector("#err-msg")
      err.textContent = msg
      err.style.display = "flex"
      setTimeout(() => err.style.display = "none", 5000)
  }