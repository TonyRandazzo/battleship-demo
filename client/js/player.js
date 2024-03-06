function initMap(size) {
  const array = new Array(size).fill(0);
  array.forEach((val, index) => {
    array[index] = new Array(size).fill(0);
  });
  return array;
}

class Player {
  constructor(name) {
    this.name = name;
    this.map = initMap(SIZE);
    this.state = initMap(SIZE);

    this.setUpComplete = false;
    this.setUpRotate = false;
    this.setUpStage = 1;

    this.hitCount = new Array(6).fill(0);
    this.sinkCount = 0;
  }


  clear() {
    this.map = initMap(SIZE);
    this.state = initMap(SIZE);
    this.setUpComplete = false;
    this.setUpRotate = false;
    this.setUpStage = 1;
    this.hitCount = new Array(6).fill(0);
    this.sinkCount = 0;
  }


  checkSink(index) {
    return this.hitCount[index] === shipLength[index];
  }


  incrementHit(index) {
    this.hitCount[index] += 1;
  }


  incrementSink() {
    this.sinkCount += 1;
  }


  checkWin() {
    return this.sinkCount === 5;
  }

  applySink(index) {
    for (let i = 0; i < SIZE; i += 1) {
      for (let j = 0; j < SIZE; j += 1) {
        if (this.map[i][j] === index) {
          this.state[i][j] = gridState.SUNK;
        }
      }
    }
  }

  getSetUpComplete() {
    return this.setUpComplete;
  }

  getSetUpRotate() {
    return this.setUpRotate;
  }

  getSetUpStage() {
    return this.setUpStage;
  }

  setSetUpComplete(val) {
    this.setUpComplete = val;
  }

  setSetUpRotate(val) {
    this.setUpRotate = val;
  }

  incrementSetUpStage(val) {
    this.setUpStage = this.setUpStage + 1;
  }


  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setMap(x, y, val) {
    this.map[x][y] = val;
  }

  getMap() {
    return this.map;
  }

  getMapAtPos(x, y) {
    return this.map[x][y];
  }

  setState(x, y, state) {
    this.state[x][y] = state;
  }

  getStateAtPos(x, y) {
    return this.state[x][y];
  }

  getState() {
    return this.state;
  }
}
