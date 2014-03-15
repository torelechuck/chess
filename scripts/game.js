//using the functional pattern for object creation/inheritance, described in "JavaScript, The good parts"

var game = function (fen) {
    var that = {};
    var positionHistory = [{}];

    //initialization of pieces on their initial squares
    function init(fen) {
        if (!fen) {
            //FEN for starting position
            fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        }
        var pieceConstructors = {p: pawn, r: rook, n: knight, b: bishop, q: queen, k: king};
        var rank = 8;
        var file = 0;
        var fenParts = fen.split(' ');
        for ( var i = 0; i < fenParts[0].length; i++ ) {
            var chr = fen.charAt(i);
            if (chr >= '0' && chr <= '9') {
                file += parseInt(chr, 10);
            } else if (chr === '/') {   
                rank--;
                file = 0;
            } else {
                file++;
                var color = 'black';
                if ( chr === chr.toUpperCase() ) { color = 'white'; }
                var square = fileCoordToLetter(file) + rank.toString();
                var piece = pieceConstructors[chr.toLowerCase()]({color: color, square: square});
                positionHistory[0][square] = piece;
            }
        }
     }

     init(fen);

    //Gets the position of the game after the move given by index, index 0 is the initial position.
    //Will get the current position if index is not given.
    that.getPosition = function (index) {
        if (!index) index = positionHistory.length - 1;
        return positionHistory[index];
    };

    that.move = function (fromSquare, toSquare) {

    };

    that.legalNextMoves = function (position) {

    };

    return that;
};

//Piece objects

//base object pieces
var piece = function (spec) {
    var that = {};

    var square = spec.square;

    that.getType = function () { return spec.type; };

    that.getPrefix = function () { return spec.prefix; };

    that.getColor = function () { return spec.color; };

    that.getSquare = function () { return square; };

    that.move = function (newSquare) { square = newSquare; };

    return that;
};

var pawn = function (spec) {
    spec.type = "pawn";
    spec.prefix = "";    
    var that = piece(spec);
    return that;
};

var rook = function (spec) {
    spec.type = "rook";
    spec.prefix = "R";    
    var that = piece(spec);
    return that;
};

var knight = function (spec) {
    spec.type = "knight";
    spec.prefix = "N";    
    var that = piece(spec);

    return that;
};

var bishop = function (spec) {
    spec.type = "bishop";
    spec.prefix = "B";    
    var that = piece(spec);

    that.getMoves = function (position) { return getBishopMoves(that, position); };//(that);

    return that;
};

function getBishopMoves(piece, position) {
    var res = [];
    var deltas = [[1,1], [1, -1], [-1, 1], [-1, -1]];
    var coords = [];
    for (var i = 0; i < deltas.length; i++) {
        coords = squareToCoords(piece.getSquare());
        do {
            coords = [coords[0] + deltas[i][0], coords[1] + deltas[i][1]];
            if (isOnBoard(coords)) {
                res.push(coordsToSquare(coords));    
            } else {
                break;
            }
        } while (true);
    }
    return res;
}

var queen = function (spec) {
    spec.type = "queen";
    spec.prefix = "Q";     
    var that = piece(spec);
    return that;
};

var king = function (spec) {
    spec.type = "king";
    spec.prefix = "K";    
    var that = piece(spec);
    return that;
};

//utility functions

function isOnBoard(coords) {
    var rank = coords[0];
    var file = coords[1];
    return (1 <= rank && rank <= 8) && (1 <= file && file <= 8);
}

function squareToCoords (square) {
    return [parseInt(square[1]), fileLetterToCoord(square[0])];
}

function coordsToSquare (coords) {
    return fileCoordToLetter(coords[1]) + coords[0].toString();
}

var fileCoordToLetter = (function () {
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return function (index) {
        return letters[index - 1];
    };
})();

var fileLetterToCoord = (function () {
    var indexes = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 7};
    return function (letter) {
        return indexes[letter];
    };
})();