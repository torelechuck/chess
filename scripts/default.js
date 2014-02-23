/*View*/

$(document).ready(function(){
    initGame();
    drawBoard();
    $( ".piece" ).draggable({revert: "invalid"});
    $( ".square" ).droppable({accept: ".piece",
                              drop: drop});
})

function drawBoard() {
    squares = getSquares();
    for(var i = 0; i < squares.length; i++) {
        var square = squares[i];
        var $squareDiv = $('<div id ="' + square.name  + '" class ="square ' + square.color + "Square" + 
                           '" data-square="' + square.name + '"></div >'); 
        $squareDiv.appendTo($('#board'));
        var piece = square.piece;
        if (piece) {
            var pieceClass = piece.color + piece.type;
            var $pieceImg = $('<img draggable="false" class="' + pieceClass + ' piece"' + 
                              ' src =" pieces/' + pieceClass + '.svg"/>');
            $pieceImg.appendTo($squareDiv);

        };
    };
}

function drop(event, ui) {
    ui.draggable
    .detach()
    .appendTo($(this))
    .css("left", 0)
    .css("top", 0);
}

/*Model*/

var gameBoard = null;

function getSquares(orientation) {
    var result = [];
    for (var rank = gameBoard.length - 1; rank >= 0; rank--) {
        for (var file = 0; file < gameBoard.length; file++) {
          result.push(gameBoard[rank][file]);
        };
    };        
    return result;
}

function initGame() {
    gameBoard = initBoard();
    initPieces(gameBoard);
    return gameBoard;
}

function initBoard() {
    var fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var board = new Array(8);
    for (var rank = 0; rank < board.length; rank++) {
        board[rank] = new Array(8);
        for (var file = 0; file < board[rank].length; file++) {
            var color = 'white';
            if (file%2 - rank%2 === 0) color = 'black';
            board[rank][file] = {
                name: fileLetters[file] + (rank + 1),
                piece: null,
                color: color
            };
        };
    };
    return board;
}

function initPieces(board) {
    initNonPawns(board[0], "white");
    initPawns(board[1], "white");
    initPawns(board[6], "black");
    initNonPawns(board[7], "black");
}

function initPawns(rank, color) {
    for (var i = 0; i < rank.length; i++) {
        rank[i].piece = {
            type: "pawn",
            prefix: "",
            color: color
        };
    };
}

function initNonPawns(rank, color) {
    var fileTypes = ["rook", "night", "bishop", "queen", "king", "bishop", "night", "rook"];
    for (var i = 0; i < rank.length; i++) {
        rank[i].piece = {
            type: fileTypes[i],
            prefix: fileTypes[i].substr(0,1).toUpperCase(),
            color: color
        };
    };
}





