class InitialScreen {

  constructor(store, game, el) {
    this.store = store;
    this.game = game;
    this.el = el;
    this.render();
  }

  handleSubmit(e) {
    e.preventDefault();
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    this.store.player1.setName(player1.value);
    this.store.player2.setName(player2.value);
    this.game.startSetUp(this.store.player1);
  }


  render() {
    this.el.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'init';


    const title = document.createElement('h1');
    const titleText = document.createTextNode('Battleship Demo');
    title.appendChild(titleText);
    container.appendChild(title);


    const form = document.createElement('form');
    form.className = 'init__form';
    form.onsubmit = (e) => { this.handleSubmit(e); };
    container.appendChild(form);

    const label1 = document.createElement('label');
    const label1Text = document.createTextNode('Player 1: ');
    label1.appendChild(label1Text);
    label1.className = 'init__form-item';
    const input1 = document.createElement('input');
    input1.id = 'player1';
    input1.type = 'text';
    input1.defaultValue = this.store.player1.getName();
    label1.appendChild(input1);
    form.appendChild(label1);

    const label2 = document.createElement('label');
    const label2Text = document.createTextNode('Player 2: ');
    label2.appendChild(label2Text);
    label2.className = 'init__form-item';
    const input2 = document.createElement('input');
    input2.id = 'player2';
    input2.type = 'text';
    input2.defaultValue = this.store.player2.getName();
    label2.appendChild(input2);
    form.appendChild(label2);

    const button = document.createElement('button');
    const buttonText = document.createTextNode('Start Game!');
    button.className = 'init__button';
    button.appendChild(buttonText);
    form.appendChild(button);

    this.el.appendChild(container);
  }
}
