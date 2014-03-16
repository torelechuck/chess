//globals vars initialized in setup functions
var newGame, initPos, squares;
var unblockedPos, blockedPos;

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

//helper function
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

module( 'utility functions' );

test('test squareToCoords', function () {
    deepEqual([4,5], squareToCoords('e4'), '[4,5] equal to e4');
});

test('test coordsToSquare', function () {
    deepEqual('e4', coordsToSquare([4,5]), 'e4 equal to [4,5]');
});

test('test is on board', function () { 
    ok(isOnBoard([4,5]), '[4,5] (e4) is on board');
    ok(isOnBoard([1,1]), '[1,1] (a1) is on board');
    ok(isOnBoard([8,8]), '[8,8] (h8) is on board');
    ok(isOnBoard([1,8]), '[1,8] (h1) is on board');
});

test('test is not on board', function () { 
    ok(!isOnBoard([9,5]), '[9,5] is on board');
    ok(!isOnBoard([0,1]), '[0,1] is on board');
    ok(!isOnBoard([4,9]), '[4,9] is on board');
    ok(!isOnBoard([1,0]), '[1,0] is on board');
});

module( 'bishop moves', {
    setup: function() {
        newGame = game();
        initPos = newGame.getPosition();
        unblockedPos = game('4k3/8/8/8/3B4/8/8/3K4').getPosition();
        blockedPos = game('8/8/1r6/8/3B4/8/8/8').getPosition();
    }
});

test('test no legal bishop moves when blocked on init position', function () {
    deepEqual(initPos["c1"].getMoves(initPos), [], "no legal moves on square c3");
    deepEqual(initPos["f1"].getMoves(initPos), [], "no legal moves on square c3");
    deepEqual(initPos["c8"].getMoves(initPos), [], "no legal moves on square c3");
    deepEqual(initPos["f8"].getMoves(initPos), [], "no legal moves on square c3");
});

test('test legal moves non-blocked bishop on d4', function () {
    var legalMoves = ['a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8',
                      'g1', 'f2', 'e3', 'c5', 'b6', 'a7'];
    var calculatedMoves = unblockedPos['d4'].getMoves(unblockedPos);
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "bishop moves");
});

test('test bishop can move to square of opposing piece', function () {
    var calculatedMoves = blockedPos['d4'].getMoves(blockedPos);
    ok(jQuery.inArray('b6', calculatedMoves) > -1, 'square of opposing piece (b6) in bishop moves from d4')
});

test('test bishop can not move past square of opposing piece', function () {
    var calculatedMoves = blockedPos['d4'].getMoves(blockedPos);
    ok(jQuery.inArray('a7', calculatedMoves) === -1, 'square past opposing piece (a7) not in bishop moves from d4')
});

module( 'rook moves', {
    setup: function() {
        newGame = game();
        initPos = newGame.getPosition();
        unblockedPos = game('8/8/8/8/3R4/8/8/8').getPosition();
        blockedPos = game('8/8/3b4/8/3R4/8/3N4/8').getPosition();
    }
});

test('test no legal rook moves when blocked on init position', function () {
    deepEqual(initPos["a1"].getMoves(initPos), [], "no legal moves on square c3");
    deepEqual(initPos["h1"].getMoves(initPos), [], "no legal moves on square c3");
    deepEqual(initPos["a8"].getMoves(initPos), [], "no legal moves on square c3");
    deepEqual(initPos["h8"].getMoves(initPos), [], "no legal moves on square c3");
});

test('test legal moves non-blocked rook on d4', function () {
    var legalMoves = ['d5', 'd6', 'd7', 'd8', 'e4', 'f4', 'g4', 'h4',
                      'd3', 'd2', 'd1', 'c4', 'b4', 'a4'];
    var calculatedMoves = unblockedPos['d4'].getMoves(unblockedPos);
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "unblocked rook moves");
});

test('test rook can move to square of opposing piece', function () {
    var calculatedMoves = blockedPos['d4'].getMoves(blockedPos);
    ok(jQuery.inArray('d6', calculatedMoves) > -1, 'square of opposing piece (d6) in rook moves from d4')
});

test('test rook can not move past square of opposing piece', function () {
    var calculatedMoves = blockedPos['d4'].getMoves(blockedPos);
    ok(jQuery.inArray('d7', calculatedMoves) === -1, 'square past opposing piece (d7) not in rook moves from d4')
});

test('test rook can not move to square of same color piece', function () {
    var calculatedMoves = blockedPos['d4'].getMoves(blockedPos);
    ok(jQuery.inArray('d2', calculatedMoves) === -1, 'square on same color piece (d2) not in rook moves from d4')
});

module( 'queen moves', {
    setup: function() {
        newGame = game();
        initPos = newGame.getPosition();
        blockedPos = game('8/R2N4/5r2/8/3Q4/8/3b4/8').getPosition();
    }
});

test('test no legal queen moves when blocked on init position', function () {
    deepEqual(initPos["d1"].getMoves(initPos), [], "no legal moves on square c3");
    deepEqual(initPos["d8"].getMoves(initPos), [], "no legal moves on square c3");
});

test('test blocking/non-blocking queen moves', function () {
    var legalMoves = ['a1', 'b2', 'c3', 'c5', 'b6', 'e3', 'f2', 'g1', 'e5', 'f6',
                      'd5', 'd6', 'e4', 'f4', 'g4', 'h4', 'd3', 'd2', 'c4', 'b4', 'a4'];
    var calculatedMoves =  blockedPos['d4'].getMoves(blockedPos);
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "blocked/unblocked queen moves");
});


