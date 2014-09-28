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
        var pieceConstructors = {p: blackPawn, r: rook, n: knight, b: bishop, q: queen, k: king,
                                 P: whitePawn, R: rook, N: knight, B: bishop, Q: queen, K: king};
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
                var piece = pieceConstructors[chr]({color: color, square: square});
                that.pieces[square] = piece;
            }
        }
        activeColor = (fenParts[1] === "w") ? "white" : "black"; 
        legalCastling = fenParts[2];//string with KkQq
        enPassantTarget = fenParts[3]; //square or "-"
        halfMoveClock = parseInt(fenParts[4]);
        fullMoveNumber = parseInt(fenParts[5]);        
    } 

    that.getMoves = function (square) {
        var piece = that.getPiece(square);
        if (!piece) return [];
        return piece.getMoves(that.pieces); 
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
        if (piece.getColor() !== activeColor) {
            return false;
        }
        return piece.getMoves(that.pieces).indexOf(toSquare) !== -1; 
    };

    //assumes legal move
    that.isCapture = function (fromSquare, toSquare) {
        var fromPiece = that.pieces[fromSquare];        
        var toPiece = that.pieces[toSquare];
        return toPiece && fromPiece.getColor() !== toPiece.getColor();
    };

    //mutate object for given move, returns an object representing the move.
    //assumes legal move
    that.move = function (fromSquare, toSquare) {
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
        piece.move(toSquare);
        delete that.pieces[fromSquare];    
        res.fromSquare = fromSquare;
        res.toSquare = toSquare; 
        return res;
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
 
    that.getMoves = function (position) {
        return getPawnMoves(that, position);
    };
    
    return that;
};

var whitePawn = function (spec) {
    var that = pawn(spec);

    that.getDir = function () { return 1; };
    that.getInitRank = function () { return 2; };
    that.getPromotionRank = function () { return 8; };

    return that;
};

var blackPawn = function (spec) {
    var that = pawn(spec);

    that.getDir = function () { return -1; };
    that.getInitRank = function () { return 7; };
    that.getPromotionRank = function () { return 1; };

    return that;
};

var rook = function (spec) {
    spec.type = "rook";
    spec.prefix = "R";    
    var that = piece(spec);

    that.getMoves =  function (position) {
        return getRookMoves(that, position); 
    };

    return that;
};

var knight = function (spec) {
    spec.type = "knight";
    spec.prefix = "N";    
    var that = piece(spec);

    that.getMoves = function (position) {
        return getKnightMoves(that, position);
    };

    return that;
};

var bishop = function (spec) {
    spec.type = "bishop";
    spec.prefix = "B";    
    var that = piece(spec);

    that.getMoves = function (position) { 
        return getBishopMoves(that, position);
    };

    return that;
};

var queen = function (spec) {
    spec.type = "queen";
    spec.prefix = "Q";     
    var that = piece(spec);

    that.getMoves = function (position) {
        return getQueenMoves(that, position);
    };

    return that;
};

var king = function (spec) {
    spec.type = "king";
    spec.prefix = "K";    
    var that = piece(spec);

    that.getMoves = function (position) {
        return getKingMoves(that, position);
    };

    return that;
};

//Move functions

function getPawnMoves (piece, position) {
    var res = [];
    var coords = squareToCoords(piece.getSquare());
    //move one square forward
    var move1Coords = [coords[0] + piece.getDir(), coords[1]];
    var move1Square = coordsToSquare(move1Coords);
    if (isOnBoard(move1Coords) && !position[move1Square]) {
        res.push(move1Square);
    }
    //move two squares forward
    if (coords[0] === piece.getInitRank()) {
        var move2Coords = [coords[0] + 2*piece.getDir(), coords[1]];
        var move2Square = coordsToSquare(move2Coords);
        if (!position[move1Square] && !position[move2Square]) {
           res.push(move2Square); 
        }
    }
    //capture on diagonal neighbour
    function addDiagonalMove (captureCoords) {
        var captureSquare = coordsToSquare(captureCoords);
        if (isOnBoard(captureCoords) && 
            position[captureSquare] && 
            position[captureSquare].getColor() !== piece.getColor()) {
                res.push(captureSquare);
        }
    }
    addDiagonalMove([coords[0] + piece.getDir(), coords[1] - 1]);
    addDiagonalMove([coords[0] + piece.getDir(), coords[1] + 1]);
    //TODO: promotion and en passant.
    return res;
}

function getKnightMoves(piece, position) {
    var deltas = [[2, 1], [1, 2], [-1, 2], [-2, 1], 
                  [-2, -1], [-1, -2], [1, -2], [2, -1]];
    return getKingAndKnightMoves(piece, position, deltas);
}

function getKingMoves(piece, position) {
    var deltas = [[1, 0], [1, 1], [0, 1], [-1, 1], 
                  [-1, 0], [-1, -1], [0, -1], [1, -1]];
    return getKingAndKnightMoves(piece, position, deltas);
}

function getKingAndKnightMoves(piece, position, deltas) {
    var destSquare, destCoords, otherColor;
    var res = [];
    var sourceCoords = squareToCoords(piece.getSquare());
    for (var i = 0; i < deltas.length; i++) {
        destCoords = [sourceCoords[0] + deltas[i][0], sourceCoords[1]+ deltas[i][1]];
        destSquare = coordsToSquare(destCoords);
        otherColor = null;
        if (position[destSquare]) { 
            otherColor = position[destSquare].getColor();
        }

        if (isOnBoard(destCoords) && (!otherColor || piece.getColor() !== otherColor)) {
            res.push(destSquare);
        }
    }
    return res;
}

function getRookMoves(piece, position) {
    var deltas = [[1,0], [0, 1], [-1, 0], [0, -1]];
    return getStraightLineMoves(piece, position, deltas); 
}

function getBishopMoves(piece, position) {
        var deltas = [[1,1], [1, -1], [-1, 1], [-1, -1]];
        return getStraightLineMoves(piece, position, deltas); 
}

function getQueenMoves(piece, position) {
    var bishopMoves = getBishopMoves(piece, position);
    var rookMoves = getRookMoves(piece, position);
    return bishopMoves.concat(rookMoves);
}

//helper function for bishop, rook and queen moves
function getStraightLineMoves(piece, position, deltas) {
    var res = [];
    var square, otherColor, coords;
    for (var i = 0; i < deltas.length; i++) {
        coords = squareToCoords(piece.getSquare());
        do {
            coords = [coords[0] + deltas[i][0], coords[1] + deltas[i][1]];
            square = coordsToSquare(coords);
            otherColor = null;
            if (position[square]) { 
                otherColor = position[square].getColor();
            }
            
            if (!isOnBoard(coords) || (otherColor && piece.getColor() === otherColor)) {
                break;
            } else if (otherColor && piece.getColor() !== otherColor) {
                res.push(square);
                break;
            } else {
                res.push(square);
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

