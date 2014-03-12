//using the functional pattern for object creation/inheritance, described in "JavaScript, The good parts"

var game = function (fen) {
    var that = {};
    var positionHistory = [{}];
    var fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    //Private functions for initialization of pieces on their initial positions:

    function initPiece(file, rank, piece) {
        var squareName = fileLetters[file-1] + rank.toString();
        positionHistory[0][squareName] = piece;
    }

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
                var piece = pieceConstructors[chr.toLowerCase()](color);
                initPiece(file, rank, piece);
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

//base object pieces
var piece = function (spec) {
    var that = {};

    that.getType = function () { return spec.type; };

    that.getPrefix = function () { return spec.prefix; };

    that.getColor = function () { return spec.color; };

    that.getPosition = function () { return position; };

    that.move = function (newPosition) { position = newPosition; };

    return that;
};

var pawn = function (color) {
    var spec = {color: color, type: "pawn", prefix: ""};    
    var that = piece(spec);
    return that;
};

var rook = function (color) {
    var spec = {color: color, type: "rook", prefix: "R"};    
    var that = piece(spec);
    return that;
};

var knight = function (color) {
    var spec = {color: color, type: "knight", prefix: "N"};    
    var that = piece(spec);

    return that;
};

var bishop = function (color) {
    var spec = {color: color, type: "bishop", prefix: "B"};    
    var that = piece(spec);

    that.getMoves = getBishopMoves;

    return that;
};

function getBishopMoves(position) {

}

var queen = function (color) {
    var spec = {color: color, type: "queen", prefix: "Q"};    
    var that = piece(spec);
    return that;
};

var king = function (color) {
    var spec = {color: color, type: "king", prefix: "K"};    
    var that = piece(spec);
    return that;
};