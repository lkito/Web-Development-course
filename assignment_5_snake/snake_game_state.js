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
        this._currentSnakeState = JSON.parse(JSON.stringify(snakeState)); // Deepcopy object
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
    
    /**
     * Simulates one turn of playing. Moves snake by one tile.
     * If snake dies, calls stopGame() and returns score.
     * If snake eats food, adds to score and "adds" a new tail to the snake.
     * If snake doesn't die, returns -1 to indicate that game hasn't finished yet.
     * 
     * @returns {number}  Final score(>=0) if game has finished. returns -1 if game hasn't finished.
     */
    playOneStep(){
        // Last state of head
        let newRow = this._currentSnakeState.body[0].row;
        let newCol = this._currentSnakeState.body[0].col;
        switch(this._currentSnakeState.curDirection){ // Get new position
            case config.dirTop:
                newRow--;
                break;
            case config.dirDown:
                newRow++;
                break;
            case config.dirLeft:
                newCol--;
                break;
            case config.dirRight:
                newCol++;
                break;
            default:
                console.log("ERROR in playOneStep() method: unknown direction memorized in current snake state!");
        }
        if(this._isCollision(newRow, newCol)){ // If we crash, stop game and return result score
            return this.stopGame();
        }
        this._currentSnakeState.body.unshift({ // Add new head to state and screen
            row: newRow,
            col: newCol,
            elem: this._drawRect(newRow, newCol, config.snakeColor)
        });
        if(this._isFood(newRow, newCol)){ // If it's food, delete it and add 1 to current score
            this._currentScore++;
            this._deleteRect(this._food.elem);
            this._spawnRandomFood();
        } else { // If it's not food, delete snake's tail
            this._deleteRect(this._currentSnakeState.body.pop().elem);
        }
        return -1; // Return -1 to indicate that game hasn't finished
    }
    
    /**
     * This is basically a destructor. *DO NOT* call any methods after calling this one.
     * Clears screen and returns accumulated score.
     * 
     * @returns {number}  Score accumulated in current game
     */
    stopGame(){
        // Store score in localstorage if it's max
        if(this._currentScore > SnakeGameState.getMaxScore()) this._setMaxScore(this._currentScore);
        // Delete snake
        this._currentSnakeState.body.map(entry => {
            this._deleteRect(entry.elem);
        });
        // Delete food
        this._deleteRect(this._food.elem);
        return this._currentScore;
    }

    /**
     * @returns {number}  Max game score stored in localstorage
     */
    static getMaxScore(){
        return localStorage.getItem(config.maxScoreKey);
    }


                    /* PRIVATE HELPER FUNCTIONS BELOW THIS LINE. TREAD CAREFULLY... */
    

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
     * @returns {boolean}   True if collision is going to happen, else returns false
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
     * @param {number} row  Number of the row to be checked
     * @param {number} col  Number of the row to be checked
     * @returns {boolean}   True if there is a food on the passed position, returns false otherwise.
     */
    _isFood(row, col){
        return row == this._food.row && col == this._food.col;
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
     * @param {number} row     Screen row number
     * @param {number} col     Screen column number
     * @param {string} color   Color of the new rectangle
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

export default SnakeGameState;