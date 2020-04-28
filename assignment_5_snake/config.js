const config = {
    rectSize: 13,   // Side of single square(e.x. food) in pixels
    dirTop: 'ArrowUp',      // Directions of movement
    dirDown: 'ArrowDown',
    dirLeft: 'ArrowLeft',
    dirRight: 'ArrowRight',
    numRows: 40,        // Number of rows on screen
    numColumns: 40,     // Number of columns on screen
    snakeState: {       // Snake state defining object
        body: [{row:14, col:4}, {row:14, col:3}, {row:14, col:2}, {row:14, col:1}, {row:14, col:0}], // head---tail
        curDirection: 'ArrowRight'
    },
    maxScoreKey: 'max_score',
    snakeColor: 'blue',
    foodColor: 'red',
    rectClassName: 'game-screen__game-character',
    screenElemID: 'snake-game-screen',
    scoreDisplayID: 'score-display',
    ticRate: 100        // Game speed
};

export default config; 