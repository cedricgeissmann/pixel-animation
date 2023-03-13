export default class EventHandler {
  constructor() {
    this.events = new Set()
  
    window.onkeydown = (ev) => {this.events.add(ev.code)}
    window.onkeyup = (ev) => {this.events.delete(ev.code)}
  }

  _handleEvents(gameObject) {
    this.events.forEach((ev) => gameObject.handle(ev))
  }
}

