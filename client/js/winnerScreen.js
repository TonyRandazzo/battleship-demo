class WinnerScreen {
  constructor(store, game, el, player) {
    this.game = game;
    this.el = el;
    this.player = player;
    this.render();
  }


  handleClick() {
    this.game.init();
  }

  render() {
    this.el.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'init';


    const title = document.createElement('h1');
    const titleText = document.createTextNode(`${this.player.getName()} Wins!`);
    title.appendChild(titleText);
    container.appendChild(title);


    const button = document.createElement('button');
    const buttonText = document.createTextNode('Play again!');
    button.className = 'init__button';
    button.onclick = () => {
      this.handleClick();
    };
    button.appendChild(buttonText);

    container.appendChild(button);

    this.el.appendChild(container);
  }
}
