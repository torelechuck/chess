$(document).ready(function(){
    var board = createBoard();
    drawBoard(board);
})

function drawBoard(board) {
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board.length; col++) {
            var colorClass = 'whiteSquare';
            if( col%2 - row%2 === 0 ) colorClass = 'blackSquare';
            var $square = $('<div id ="' + board[row][col]  + '" class ="' + colorClass + '"></div >'); 
            $square.appendTo($('#board'));
        };
    };
}

function createBoard() {
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var board = new Array(8);
    for (var row = 0; row < 8; row++) {
        board[row] = new Array(8);
        for (var col = 0; col < 8; col++) {
            board[row][col] = letters[col] + (row + 1);
        };
    };
    return board;
}