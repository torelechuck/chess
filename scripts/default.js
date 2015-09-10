var game;

$(document).ready(function(){
    game = gameLogic.game();
    loadGameUI();

    $("#prev").click(function () {
        game.prev();
        $("#board").children().remove();
        loadGameUI();
    });
    $("#next").click(function () {
        game.next();
        $("#board").children().remove();
        loadGameUI();
    });

});

function loadGameUI() {
    drawBoard();
    setDragDrop();
    enableButtons();
}

function drawBoard() {
    for (var rank = 7; rank >= 0; rank--) {
        for (var file = 0; file < 8; file++) {
            var color = 'white';
            if (file%2 - rank%2 === 0) color = 'black';
            var square = gameLogic.fileLetters[file] + (rank + 1); 
            var $squareDiv = $('<div id ="' + square + '" class ="square ' + color + "Square" + '"></div >'); 
            $squareDiv.appendTo($('#board'));
            var piece = game.getPiece(square);
            if (piece) {
                var pieceClass = piece.color + piece.type;
                var $pieceImg = $('<img draggable="false" class="' + pieceClass + ' piece"' + 
                                  ' src =" pieces/' + pieceClass + '.svg"/>');
                $pieceImg.appendTo($squareDiv);
            }
        }
    }
}

function setDragDrop() {
    $( ".piece" ).draggable({revert: "invalid",
        zIndex: 100
    });
    $( ".square" ).droppable({accept: ".piece",
        drop: drop
    });
}

function enableButtons() {
    $("#prev").prop("disabled", game.isFirstMove());
    $("#next").prop("disabled", game.isLastMove());
}

function drop(event, ui) {
    var fromSquare = ui.draggable.parent().attr("id");
    var toSquare = $(this).attr("id");
    if(!game.isLegalMove(fromSquare, toSquare)) {
        ui.draggable.css("left", 0).css("top", 0);
        return;
    }
    if(game.isCapture(fromSquare, toSquare)) {
        $(this).children().remove();
    }
    ui.draggable
    .detach()
    .appendTo($(this))
    .css("left", 0)
    .css("top", 0);
    game.move(fromSquare, toSquare);
    enableButtons();
}