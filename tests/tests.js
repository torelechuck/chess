var newGame, initPos, squares;

module( 'Setup game', {
    setup: function() {
        newGame = game();
        initPos = newGame.getPosition();  
        var fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        squares = [];
        for (var i = 0; i < 8; i++) {
            squares.push([]);
            for (var j = 0; j < 8; j++) {
                var rank = i + 1;
                squares[i].push(fileLetters[j] + rank.toString());
            }
        }
    }
});

//Helper function
function checkSquare(square, type, color) {
    var piece = initPos[square];
    ok(piece.getType() === type && piece.getColor() === color, 
        square + " has a " + piece.getColor() + " " + piece.getType());
}

test( "test new game initialized with 32 pieces", function () {
    var position = newGame.getPosition();
    strictEqual(Object.keys(position).length, 32, "New game has 32 pieces");
});

test("test white pawns initialized on rank 2", function () {
    var rank2 = squares[1];
    for (var i = 0; i < rank2.length; i++) {
        checkSquare(rank2[i], "pawn", "white");
    }
});

test("test black pawns initialized on rank 7", function () {
    var rank7 = squares[6];
    for (var i = 0; i < rank7.length; i++) {
        checkSquare(rank7[i], "pawn", "black");
    }
});

test("test initial rook posititions", function () {
    checkSquare(squares[0][0], "rook", "white");
    checkSquare(squares[0][7], "rook", "white");
    checkSquare(squares[7][0], "rook", "black");
    checkSquare(squares[7][7], "rook", "black");
});

test("test initial knight posititions", function () {
    checkSquare(squares[0][1], "knight", "white");
    checkSquare(squares[0][6], "knight", "white");
    checkSquare(squares[7][1], "knight", "black");
    checkSquare(squares[7][6], "knight", "black");
});

test("test initial bishop posititions", function () {
    checkSquare(squares[0][2], "bishop", "white");
    checkSquare(squares[0][5], "bishop", "white");
    checkSquare(squares[7][2], "bishop", "black");
    checkSquare(squares[7][5], "bishop", "black");
});

test("test initial queen posititions", function () {
    checkSquare(squares[0][3], "queen", "white");
    checkSquare(squares[7][3], "queen", "black");
});

test("test initial king posititions", function () {
    checkSquare(squares[0][4], "king", "white");
    checkSquare(squares[7][4], "king", "black");
});
