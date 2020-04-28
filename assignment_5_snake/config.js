const config = {
    rectSize: 13,   // Side of single square(e.x. food) in pixels
    dirTop: 'top',      // Directions of movement
    dirDown: 'bottom',
    dirLeft: 'left',
    dirRight: 'right',
    numRows: 40,        // Number of rows on screen
    numColumns: 40,     // Number of columns on screen
    snakeState: {       // Snake state defining object
        body: [{row:14, col:4}, {row:14, col:3}, {row:14, col:2}, {row:14, col:1}, {row:14, col:0}], // head---tail
        curDirection: 'right'
    },
    maxScoreKey: 'max_score',
    snakeColor: 'blue',
    foodColor: 'red',
    rectClassName: 'game-screen__game-character',
    screenElemID: 'snake-game-screen'
};

export default config; 