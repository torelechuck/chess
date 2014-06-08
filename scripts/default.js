
var game;

$(document).ready(function(){
    game = game();
    drawBoard();
    $( ".piece" ).draggable({revert: "invalid"});
    $( ".square" ).droppable({accept: ".piece",
                              drop: drop});
})

function drawBoard() {
    var fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var rank = 0; rank < 8; rank++) {
        for (var file = 0; file < 8; file++) {
            var color = 'white';
            if (file%2 - rank%2 === 0) color = 'black';
            var square = fileLetters[file] + (rank + 1); 
            var $squareDiv = $('<div id ="' + name  + '" class ="square ' + color + "Square" + '"></div >'); 
            $squareDiv.appendTo($('#board'));
            var piece = game.getPiece(square);
            if (piece) {
                var pieceClass = piece.getColor() + piece.getType();
                var $pieceImg = $('<img draggable="false" class="' + pieceClass + ' piece"' + 
                                  ' src =" pieces/' + pieceClass + '.svg"/>');
                $pieceImg.appendTo($squareDiv);
            };

        };
    };
}

function drop(event, ui) {
    var fromSquare = ui.draggable.parent().attr("id");
    var toSquare = $(this).attr("id");
    //if( isCapture(fromSquare, toSquare, gameBoard)) {
    //    $(this).children().remove();
    //}
    ui.draggable
    .detach()
    .appendTo($(this))
    .css("left", 0)
    .css("top", 0);
    //move(fromSquare, toSquare, gameBoard);
}

