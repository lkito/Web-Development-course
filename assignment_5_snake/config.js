const config = {
    rectSize: '13px',   // Side of single square(e.x. food) in pixels
    dirTop: 'top',      // Directions of movement
    dirDown: 'bottom',
    dirLeft: 'left',
    dirRight: 'right',
    numRows: 30,        // Number of rows on screen
    numColumns: 20,     // Number of columns on screen
    snakeState: {       // Snake state defining object
        head: [14, 4],  // Row/Column
        body: [[14, 0], [14, 1], [14, 2], [14, 3]],
        curDirection: 'right'
    },
    maxScoreKey: 'max_score'
};

export default config; 