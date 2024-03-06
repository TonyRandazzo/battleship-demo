class Board {
  constructor(store, game, player) {
    this.store = store;
    this.game = game;
    this.player = player;
    this.el = document.createElement('div');
    this.el.className = 'board';
    this.x = 0;
    this.y = 0;
    this.render();
  }


  getEl() {
    return this.el;
  }


  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((event.clientY - rect.top) / GRID_SIZE);
    return { x, y };
  }


  isYourTurn() {
    return this.store.getCurrentPlayer() === this.player;
  }


  isSettingUp() {
    return this.store.getGameState() === gameState.SETUP;
  }

  
  isRotated() {
    return this.player.getSetUpRotate();
  }


  getShipLength() {
    const stage = this.player.getSetUpStage();
    return shipLength[stage];
  }


  isValidSpace(x, y) {
    const length = this.getShipLength();
    if (this.isRotated()) {
      if (x + length > SIZE) {
        return false;
      }
      for (let i = 0; i < length; i += 1) {
        if (this.player.getMapAtPos(x + i, y) !== ships.EMPTY) {
          return false;
        }
      }
      return true;
    }

    if (y + length > SIZE) {
      return false;
    }
    for (let i = 0; i < length; i += 1) {
      if (this.player.getMapAtPos(x, y + i) !== ships.EMPTY) {
        return false;
      }
    }
    return true;
  }

  onClickSetUp(event) {
    const { x, y } = this.getMousePos(event);
    const stage = this.player.getSetUpStage();
    if (!this.isValidSpace(x, y)) {
      return;
    }
    if (this.player.getMapAtPos(x, y) === ships.EMPTY) {
      if (this.isRotated()) {
        for (let i = 0; i < shipLength[stage]; i += 1) {
          this.player.setMap(x + i, y, stage);
        }
      } else {
        for (let i = 0; i < shipLength[stage]; i += 1) {
          this.player.setMap(x, y + i, stage);
        }
      }
      this.player.incrementSetUpStage();
      if (this.player.getSetUpStage() > 5) {
        this.player.setSetUpComplete(true);
      }
    }
    this.game.reRender();
  }

  onClick(event) {
    const { x, y } = this.getMousePos(event);
    if (this.player.getStateAtPos(x, y) !== 0) {
      this.store.setMessage('Already Taken!');
      return;
    }
    const target = this.player.getMapAtPos(x, y);
    if (target !== ships.EMPTY) {
      this.player.incrementHit(target);
      if (this.player.checkSink(target)) {
        this.store.setMessage('Sunk!');
        this.player.applySink(target);
        this.player.incrementSink();
        if (this.player.checkWin()) {
          this.store.setMessage('Win!');
          this.game.setWinner(this.player);
          return;
        }
        this.game.reRender();
        return;
      }
      this.player.setState(x, y, gridState.HIT);
      this.store.setMessage('Hit!');
    } else {
      this.player.setState(x, y, gridState.MISS);
      this.store.setMessage('Miss!');
      this.store.setTurn(!this.store.getTurn());
    }
    this.drawTile(x, y, COLOR[this.player.getStateAtPos(x, y)]);
    this.game.reRender();
  }


  onMouseOut() {
    this.drawGrid();
  }


  onMouseMove(event) {
    const { x, y } = this.getMousePos(event);
    if (this.x !== x || this.y !== y) {
      this.drawTile(x, y, 'gray');
    }
    this.x = x;
    this.y = y;
  }


  onMouseMoveSetUp(event) {
    const { x, y } = this.getMousePos(event);
    if (this.x !== x || this.y !== y) {
      this.drawShip(x, y);
    }
    this.x = x;
    this.y = y;
  }


  drawShip(x, y) {
    this.drawGrid();
    const xPos = x * GRID_SIZE;
    const yPos = y * GRID_SIZE;
    const length = this.getShipLength() * GRID_SIZE;
    if (this.isValidSpace(x, y)) {
      this.ctx.fillStyle = 'gray';
    } else {
      this.ctx.fillStyle = 'red';
    }
    if (this.isRotated()) {
      this.ctx.clearRect(xPos, yPos, length, GRID_SIZE);
      this.ctx.fillRect(xPos, yPos, length, GRID_SIZE);
      this.ctx.strokeRect(xPos, yPos, length, GRID_SIZE);
    } else {
      this.ctx.clearRect(xPos, yPos, GRID_SIZE, length);
      this.ctx.fillRect(xPos, yPos, GRID_SIZE, length);
      this.ctx.strokeRect(xPos, yPos, GRID_SIZE, length);
    }
  }


  drawTile(x, y, color) {
    this.drawGrid();
    const xPos = x * GRID_SIZE;
    const yPos = y * GRID_SIZE;
    this.ctx.clearRect(xPos, yPos, GRID_SIZE, GRID_SIZE);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(xPos, yPos, GRID_SIZE, GRID_SIZE);
    this.ctx.strokeRect(xPos, yPos, GRID_SIZE, GRID_SIZE);
  }


  drawGrid() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.isSettingUp()) {
      this.player.getMap().forEach((val, curX) => {
        val.forEach((state, curY) => {
          this.ctx.fillStyle = state === 0 ? 'white' : 'black';
          this.ctx.fillRect(curX * GRID_SIZE, curY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
          this.ctx.strokeRect(curX * GRID_SIZE, curY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        });
      });
      return;
    }
    this.player.getState().forEach((val, curX) => {
      val.forEach((state, curY) => {
        this.ctx.fillStyle = COLOR[state];
        this.ctx.fillRect(curX * GRID_SIZE, curY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        this.ctx.strokeRect(curX * GRID_SIZE, curY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      });
    });
  }

  render() {
    this.el.innerHTML = '';

    this.columns = document.createElement('ul');
    this.columns.classList.add('board__columns');

    this.rows = document.createElement('ul');
    this.rows.classList.add('board__rows');

    new Array(SIZE).fill(0).forEach((val, index) => {
      const column = document.createElement('li');
      const columnLabel = document.createTextNode((index + 1).toFixed());
      column.appendChild(columnLabel);
      const row = document.createElement('li');
      const rowLabel = document.createTextNode(String.fromCharCode(index + 65));
      row.appendChild(rowLabel);
      this.columns.appendChild(column);
      this.rows.appendChild(row);
    });

    this.el.appendChild(this.columns);
    this.el.appendChild(this.rows);


    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('board__canvas');
    this.canvas.width = (GRID_SIZE * 10) + 1;
    this.canvas.height = (GRID_SIZE * 10) + 1;
    this.el.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    if (this.isSettingUp()) {
      this.canvas.addEventListener('mousemove', this.onMouseMoveSetUp.bind(this), false);
      this.canvas.addEventListener('mouseout', this.onMouseOut.bind(this), false);
      this.canvas.addEventListener('click', this.onClickSetUp.bind(this), false);
    } else if (this.isYourTurn()) {
      const disable = document.createElement('div');
      disable.className = 'board-disable';
      this.el.appendChild(disable);
    } else {
      this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
      this.canvas.addEventListener('mouseout', this.onMouseOut.bind(this), false);
      this.canvas.addEventListener('click', this.onClick.bind(this), false);
    }


    this.drawGrid();
  }
}
