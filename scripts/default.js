$(document).ready(function(){
    var board = initGame();
    drawBoard(board);
})

function drawBoard(board) {
    for (var rank = board.length - 1; rank >= 0; rank--) {
        for (var file = 0; file < board.length; file++) {
            var colorClass = 'whiteSquare';
            if (file%2 - rank%2 === 0) colorClass = 'blackSquare';
            var square = board[rank][file];
            var $squareDiv = $('<div id ="' + square.name  + '" class ="' + colorClass + '"></div >'); 
            $squareDiv.appendTo($('#board'));
            var piece = square.piece;
            if (piece) {
                var pieceClass = piece.color + piece.type;
                var $pieceImg = $('<img class="' + pieceClass + ' piece" src =" pieces/' + pieceClass + '.svg"/>');
                $pieceImg.appendTo($squareDiv);
            };            
        };
    };
}

function initGame() {
    var board = initBoard();
    initPieces(board);
    return board;
}

function initBoard() {
    var fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var board = new Array(8);
    for (var rank = 0; rank < board.length; rank++) {
        board[rank] = new Array(8);
        for (var file = 0; file < board[rank].length; file++) {
            board[rank][file] = {
                name: fileLetters[file] + (rank + 1),
                piece: null
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





