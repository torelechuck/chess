//using the functional pattern for object creation/inheritance, described in "JavaScript, The good parts"

var game = function () {
    var that = {};
    var positionHistory = [{}];
    var fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    //Private functions for initialization of pieces on their initial positions:

    function init() {
        initNonPawns(0, "white");
        initPawns(1, "white");
        initPawns(6, "black");
        initNonPawns(7, "black");
    };

    function initPiece(file, rank, piece) {
        squareName = fileLetters[file] + rank.toString();
        positionHistory[0][squareName] = piece;
    };

    function initPawns (color, rank) {
        for (var file = 0; file < rank.length; file++) {
            initPiece(file, rank, pawn(color));
        };
    };

    function initNonPawns(color, rank) {
        initPiece(0, rank, rook(color));
        initPiece(1, rank, knight(color));
        initPiece(2, rank, bishop(color));
        initPiece(3, rank, queen(color));
        initPiece(4, rank, king(color));
        initPiece(5, rank, bishop(color));
        initPiece(6, rank, knight(color));
        initPiece(7, rank, rook(color));
    };

    init();

    //Gets the position of the game after the move given by index, index 0 is the initial position.
    //Will get the current position if index is not given.
    that.getPosition = function (index) {
        if (!index) index = position.length - 1;
        return positionHistory[position];
    };

    that.move = function (fromSquare, toSquare) {

    };

    that.legalNextMoves = function (position) {

    };

}

//base object pieces
var piece = function (spec) {
    var that = {};

    var position  = spec.initialPosition;

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