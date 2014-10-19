//using the functional pattern for object creation/inheritance, described in "JavaScript, The good parts"

var game = function (fen) {
    var that = {};
    var currentPosition = boardPosition(fen);

    that.getPiece = function (square) {
        return currentPosition.getPiece(square);
    };

    that.getMoves = function (square) {
        return currentPosition.getMoves(square);
    };
    
    that.isLegalMove = function (fromSquare, toSquare) {
        return currentPosition.isLegalMove(fromSquare, toSquare);
    };

    that.isCapture = function (fromSquare, toSquare) {
        return currentPosition.isCapture(fromSquare, toSquare);
    };    

    that.move = function (fromSquare, toSquare) {
        return currentPosition.move(fromSquare, toSquare);
    };

    that.getCurrentPosition = function () {
        return currentPosition;
    };

    return that;
};

//represents a particular board position
var boardPosition = function (fen) {
    var that = {};
    that.pieces = {};
    var activeColor, legalCastling, enPassantTarget, halfMoveClock, fullMoveNumber;

    init(fen);

    //initialization of pieces on their initial squares
    function init (fen) {
        if (!fen) {
            //FEN for starting position
            fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        }
        var pieces = createPieces();
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
                var square = fileCoordToLetter(file) + rank.toString();
                that.pieces[square] = pieces[chr];
            }
        }
        activeColor = (fenParts[1] === "w") ? "white" : "black"; 
        legalCastling = fenParts[2];//string with KkQq
        enPassantTarget = fenParts[3]; //square or "-"
        halfMoveClock = parseInt(fenParts[4]);
        fullMoveNumber = parseInt(fenParts[5]);        
    } 

    function createPieces() {
        var whiteRook = {type: "rook", prefix: "R", getMoves: getRookMoves, color: "white"};
        var blackRook = {type: "rook", prefix: "R", getMoves: getRookMoves, color: "black"};
        var whiteBishop = {type: "bishop", prefix: "B", getMoves: getBishopMoves, color: "white"};
        var blackBishop = {type: "bishop", prefix: "B", getMoves: getBishopMoves, color: "black"};
        var whiteKnight = {type: "knight", prefix: "N", getMoves: getKnightMoves, color: "white"};
        var blackKnight = {type: "knight", prefix: "N", getMoves: getKnightMoves, color: "black"};
        var whiteQueen = {type: "queen", prefix: "Q", getMoves: getQueenMoves, color: "white"};
        var blackQueen = {type: "queen", prefix: "Q", getMoves: getQueenMoves, color: "black"};
        var whiteKing = {type: "king", prefix: "K", getMoves: getKingMoves, color: "white"};
        var blackKing = {type: "king", prefix: "K", getMoves: getKingMoves, color: "black"};
        var whitePawn = {type: "pawn", prefix: "", getMoves: getPawnMoves, color: "white", 
                         dir: 1, initRank: 2, promotionRank: 8};
        var blackPawn = {type: "pawn", prefix: "", getMoves: getPawnMoves, color: "black", 
                         dir: -1, initRank: 7, promotionRank: 1};
        return {p: blackPawn, r: blackRook, n: blackKnight, b: blackBishop, q: blackQueen, k: blackKing,
                P: whitePawn, R: whiteRook, N: whiteKnight, B: whiteBishop, Q: whiteQueen, K: whiteKing};
    }
    
    that.getMoves = function (square) {
        var piece = that.getPiece(square);
        if (!piece) return [];
        return piece.getMoves(piece, that.pieces, square); 
    };

    that.getPiece = function (square) {
        return that.pieces[square];
    };

    that.getActiveColor = function () { 
        return activeColor;
    };

    that.isLegalMove = function (fromSquare, toSquare) {
        var piece = that.pieces[fromSquare];
        if (!piece){
            return false;
        }
        if (piece.color !== activeColor) {
            return false;
        }
        return piece.getMoves(piece, that.pieces, fromSquare).indexOf(toSquare) !== -1; 
    };

    that.isCapture = function (fromSquare, toSquare) {
        if (!that.isLegalMove(fromSquare, toSquare)){
           throw new Error('Tried an illegal move.');
        }
        var fromPiece = that.pieces[fromSquare];        
        var toPiece = that.pieces[toSquare];
        return toPiece && fromPiece.color !== toPiece.color;
    };

    //returns an object representing the move.
    that.move = function (fromSquare, toSquare) {
        if (!that.isLegalMove(fromSquare, toSquare)){
           throw new Error('Tried an illegal move.');
        }
        if (that.isCapture(fromSquare, toSquare)) {
            halfMoveClock = 0;
        }
        else {
            halfMoveClock++;
        }
        if (that.activeColor === "black") {
            fullMoveNumber++;
        }
        activeColor = (activeColor === "white") ? "black" : "white"; 
        //TODO: enPassant and castling
        //move piece:
        var res = {};
        res.capturedPiece = that.pieces[toSquare];
        var piece = that.pieces[fromSquare];
        that.pieces[toSquare] = piece; 
        delete that.pieces[fromSquare];    
        res.fromSquare = fromSquare;
        res.toSquare = toSquare; 
        return res;
    };

    return that;
};

//Move functions

function getPawnMoves (piece, board, square) {
    var res = [];
    var coords = squareToCoords(square);
    //move one square forward
    var move1Coords = [coords[0] + piece.dir, coords[1]];
    var move1Square = coordsToSquare(move1Coords);
    if (isOnBoard(move1Coords) && !board[move1Square]) {
        res.push(move1Square);
    }
    //move two squares forward
    if (coords[0] === piece.initRank) {
        var move2Coords = [coords[0] + 2*piece.dir, coords[1]];
        var move2Square = coordsToSquare(move2Coords);
        if (!board[move1Square] && !board[move2Square]) {
           res.push(move2Square); 
        }
    }
    //capture on diagonal neighbour
    function addDiagonalMove (captureCoords) {
        var captureSquare = coordsToSquare(captureCoords);
        if (isOnBoard(captureCoords) && 
            board[captureSquare] && 
            board[captureSquare].color !== piece.color) {
                res.push(captureSquare);
        }
    }
    addDiagonalMove([coords[0] + piece.dir, coords[1] - 1]);
    addDiagonalMove([coords[0] + piece.dir, coords[1] + 1]);
    //TODO: promotion and en passant.
    return res;
}

function getKnightMoves(piece, board, square) {
    var deltas = [[2, 1], [1, 2], [-1, 2], [-2, 1], 
                  [-2, -1], [-1, -2], [1, -2], [2, -1]];
    return getKingAndKnightMoves(piece, board, square, deltas);
}

function getKingMoves(piece, board, square) {
    var deltas = [[1, 0], [1, 1], [0, 1], [-1, 1], 
                  [-1, 0], [-1, -1], [0, -1], [1, -1]];
    return getKingAndKnightMoves(piece, board, square, deltas);
}

function getKingAndKnightMoves(piece, board, square, deltas) {
    var destSquare, destCoords, otherColor;
    var res = [];
    var sourceCoords = squareToCoords(square);
    for (var i = 0; i < deltas.length; i++) {
        destCoords = [sourceCoords[0] + deltas[i][0], sourceCoords[1]+ deltas[i][1]];
        destSquare = coordsToSquare(destCoords);
        otherColor = null;
        if (board[destSquare]) { 
            otherColor = board[destSquare].color;
        }

        if (isOnBoard(destCoords) && (!otherColor || piece.color !== otherColor)) {
            res.push(destSquare);
        }
    }
    return res;
}

function getRookMoves(piece, board, square) {
    var deltas = [[1,0], [0, 1], [-1, 0], [0, -1]];
    return getStraightLineMoves(piece, board, square, deltas); 
}

function getBishopMoves(piece, board, square) {
        var deltas = [[1,1], [1, -1], [-1, 1], [-1, -1]];
        return getStraightLineMoves(piece, board, square, deltas); 
}

function getQueenMoves(piece, board, square) {
    var bishopMoves = getBishopMoves(piece, board, square);
    var rookMoves = getRookMoves(piece, board, square);
    return bishopMoves.concat(rookMoves);
}

//helper function for bishop, rook and queen moves
function getStraightLineMoves(piece, board, square, deltas) {
    var res = [];
    var otherColor, destSquare, coords;
    for (var i = 0; i < deltas.length; i++) {
        coords = squareToCoords(square);
        do {
            coords = [coords[0] + deltas[i][0], coords[1] + deltas[i][1]];
            destSquare = coordsToSquare(coords);
            otherColor = null;
            if (board[destSquare]) { 
                otherColor = board[destSquare].color;
            }
            
            if (!isOnBoard(coords) || (otherColor && piece.color === otherColor)) {
                break;
            } else if (otherColor && piece.color !== otherColor) {
                res.push(destSquare);
                break;
            } else {
                res.push(destSquare);
            }
        } while (true);
    }
    return res;
}

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
    var indexes = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8};
    return function (letter) {
        return indexes[letter];
    };
})();

