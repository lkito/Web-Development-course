import config from "./config.js";

class SnakeGameState {

    /**
     * Receives information about game screen and initializes game state
     * 
     * @param {number} numRows      Number of rows on screen
     * @param {number} numColumns   Number of columns on screen
     * @param {number} rectSize     Side of single square(e.x. food) in pixels
     * @param {object} snakeState   Snake's state defining object
     */
    constructor(numRows, numColumns, rectSize, snakeState){
        this._numRows = numRows;
        this._numCols = numColumns;
        this._rectSize = rectSize;
        this._currentSnakeState = snakeState;
        this._food = {
            row: 0,
            col: 0
        }

        this._spawnRandomFood();
    }

    
    playOneStep(direction){

    }

    // Store score in localstorage if it's max
    // Returns score
    stop(direction){

    }

    getMaxScore(){

    }

                    /* PRIVATE HELPER FUNCTIONS BELOW THIS LINE */
    

    _initDrawSnake(){

    }

    _spawnRandomFood(){

    }

    _drawRect(row, col){

    }

    _deleteRect(element){

    }

}

if(['', null].includes(localStorage.getItem(config.maxScoreKey))) // Make sure we have max_score key:value initialized
    localStorage.setItem(config.maxScoreKey, '0');
const game = new SnakeGameState(config.numRows, config.numColumns, config.rectSize, config.snakeState);
// const elem = document.getElementById('bla');
// elem.style.top = elem.offsetTop + '10px';
// console.log(elem.offsetTop);
