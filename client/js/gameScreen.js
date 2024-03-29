class GameScreen {
  constructor(store, game, el) {
    this.store = store;
    this.game = game;
    this.el = el;
    this.init();
  }

  init() {
    this.store.setTurn(Math.random() < 0.5);
    this.render();
  }

  render() {
    this.el.innerHTML = '';

    const turn = document.createElement('h2');
    turn.className = 'game__displayname';
    const turnPlayer = this.store.getCurrentPlayer().getName();
    turn.innerHTML = `It's <span class="game__current_player">${turnPlayer}</span>'s Turn!`;

    const message = document.createElement('p');
    message.className = 'game__message';
    const messageText = document.createTextNode(this.store.getMessage());
    message.appendChild(messageText);

    const container = document.createElement('div');
    container.className = 'game__container';
    const player1 = new PlayerBoard(this.store, this.game, this.store.player1);
    const player2 = new PlayerBoard(this.store, this.game, this.store.player2);
    container.appendChild(player1.getEl());
    container.appendChild(player2.getEl());

    const button = document.createElement('button');
    const buttonText = document.createTextNode('Reset Game!');
    button.onclick = () => { this.game.init(); };
    button.appendChild(buttonText);

    this.el.appendChild(turn);
    this.el.appendChild(message);
    this.el.appendChild(container);
    this.el.appendChild(button);
  }
}
