class SetUpScreen {
  constructor(store, game, el, player) {
    this.store = store;
    this.game = game;
    this.el = el;
    this.player = player;
    this.render();
  }


  handleRotateClick() {
    this.player.setSetUpRotate(!this.player.getSetUpRotate());
  }


  handleClick() {
    this.player.setSetUpComplete(true);
    if (!this.store.player2.getSetUpComplete()) {
      this.game.startSetUp(this.store.player2);
    } else {
      this.game.startGame();
    }
  }

  render() {
    this.el.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'setup';

    const title = document.createElement('h2');
    const subTitle = document.createElement('p');
    if (this.player.getSetUpComplete()) {
      const titleText = document.createTextNode('Setup Complete!');
      const subTitleText = document.createTextNode('Press Done Button');
      title.appendChild(titleText);
      subTitle.appendChild(subTitleText);
    } else {
      const titleText = document.createTextNode(`${this.player.getName()} is Setting up...`);
      const subTitleText = document.createTextNode(`Place your ${ships[this.player.getSetUpStage()]}`);
      title.appendChild(titleText);
      subTitle.appendChild(subTitleText);
    }

    container.appendChild(title);
    container.appendChild(subTitle);

    const board = new Board(this.store, this.game, this.player);
    container.appendChild(board.getEl());


    const buttons = document.createElement('div');
    buttons.className = 'setup__buttons';
    container.appendChild(buttons);

    const rotateButton = document.createElement('button');
    const rotateButtonText = document.createTextNode('Rotate');
    rotateButton.appendChild(rotateButtonText);
    rotateButton.onclick = () => {
      this.handleRotateClick();
    };
    buttons.appendChild(rotateButton);

    const nextButton = document.createElement('button');
    const nextButtonText = document.createTextNode('Done');
    nextButton.appendChild(nextButtonText);
    if (this.player.getSetUpComplete()) {
      nextButton.onclick = () => {
        this.handleClick();
      };
    } else {
      nextButton.classList.add('setup__button-disabled');
    }
    buttons.appendChild(nextButton);

    this.el.appendChild(container);
  }
}
