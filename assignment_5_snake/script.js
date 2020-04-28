import config from "./config.js";

class SnakeGameState {

    /**
     * Receives information about game screen and initializes game state
     * 
     * @param {number} numRows       Number of rows on screen
     * @param {number} numColumns    Number of columns on screen
     * @param {number} rectSize      Side of single square(e.x. food) in pixels
     * @param {object} snakeState    Snake's state defining object
     * @param {object} screenObject  Screen element
     */
    constructor(numRows, numColumns, rectSize, snakeState, screenObject){
        this._numRows = numRows;
        this._numCols = numColumns;
        this._rectSize = rectSize;
        this._screenObject = screenObject;
        this._currentSnakeState = snakeState;
        this._currentScore = 0;
        this._food = {
            row: 0,
            col: 0,
            elem: 0
        }

        this._initDrawSnake();
        this._spawnRandomFood();
    }

    /**
     * Saves new direction for the next step
     * 
     * @param {string} direction New direction
     */
    updateDirection(direction){
        this._currentSnakeState.curDirection = direction;
    }
    
    playOneStep(){


    }

    // Store score in localstorage if it's max
    // Returns score
    stop(direction){
        return this._currentScore;
    }

    /**
     * @returns Max game score stored in localstorage
     */
    getMaxScore(){
        return localStorage.getItem(config.maxScoreKey);
    }

                    /* PRIVATE HELPER FUNCTIONS BELOW THIS LINE */
    

    /**
     * Draws snake on screen. Called once during constructing instance
     */
    _initDrawSnake(){
        this._currentSnakeState.body.map(entry => {
            entry.elem = this._drawRect(entry.row, entry.col, config.snakeColor);
        });
    }

    /**
     * Adds food on the screen randomly, where it's empty and saves the element
     */
    _spawnRandomFood(){
        let newRow = 0;
        let newCol = 0;
        while(true){
            newRow = Math.floor(Math.random() * this._numRows);
            newCol = Math.floor(Math.random() * this._numCols);
            if(!this._currentSnakeState.body.filter(elem => elem.row == newRow && elem.col == newCol).length > 0) {
                break;
            }
        }
        this._food = {
            row: newRow,
            col: newCol,
            elem: this._drawRect(newRow, newCol, config.foodColor)
        };
    }

    /**
     * @param {number} row  Row of the point to be checked
     * @param {number} col  Column of the point to be checked
     * @returns             True if collision is going to happen, else returns false
     */
    _isCollision(row, col){
        // Check for collision with walls
        if(row < 0 || col < 0 || row >= this._numRows || col >= this._numCols) return true;
        // Check for collision with tail
        if (this._currentSnakeState.body.filter(elem => elem.row == row && elem.col == col).length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Stores new max score value in localStorage
     * 
     * @param {number} score New score value
     */
    _setMaxScore(score){
        return localStorage.setItem(config.maxScoreKey, score);
    }

    /**
     * Receives position and color of rectangle. Adds a new div
     * of that color on screen and returns the new element
     * 
     * @param {number} row    // Screen row number
     * @param {number} col    // Screen column number
     * @param {string} color  // Color of the new rectangle
     */
    _drawRect(row, col, color){
        const elem = document.createElement('div');
        elem.className = config.rectClassName;
        elem.style.backgroundColor = color;
        elem.style.left = this._rectSize * col + 'px';
        elem.style.top = this._rectSize * row + 'px';
        this._screenObject.appendChild(elem);
        return elem;
    }

    /**
     * Deletes element from screen
     * 
     * @param {Object} element Element to remove
     */
    _deleteRect(element){
        element.parentNode.removeChild(element);
    }

}

if(['', null].includes(localStorage.getItem(config.maxScoreKey))) // Make sure we have max_score key:value initialized
    localStorage.setItem(config.maxScoreKey, '0');
const game = new SnakeGameState(config.numRows, config.numColumns, config.rectSize, config.snakeState, document.getElementById(config.screenElemID));
// const rect = game._drawRect(39, 39, config.foodColor);
// game._drawRect(0, 0, config.snakeColor);
// game._deleteRect(rect);
// console.log(game.getMaxScore());
// game._setMaxScore(5);
// console.log(game.getMaxScore());
