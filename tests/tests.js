//globals vars initialized in setup functions
var newGame, squares;
var unblockedPos, blockedPos;

module( 'Setup game', {
    setup: function() {
        newGame = game();
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
    var piece = newGame.getPiece(square);
    ok(piece.type === type && piece.color === color, 
        square + " has a " + piece.color + " " + piece.type);
}

test( "test new game initialized with 32 pieces", function () {
    var pieces = newGame.getCurrentPosition().pieces;
    strictEqual(Object.keys(pieces).length, 32, "New game has 32 pieces");
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

test('test is on board', function () { 
    ok(isOnBoard([4,5]), '[4,5] (e4) is on board');
    ok(isOnBoard([1,1]), '[1,1] (a1) is on board');
    ok(isOnBoard([8,8]), '[8,8] (h8) is on board');
    ok(isOnBoard([1,8]), '[1,8] (h1) is on board');
});

test('test is not on board', function () { 
    ok(!isOnBoard([9,5]), '[9,5] is not on board');
    ok(!isOnBoard([0,1]), '[0,1] is not on board');
    ok(!isOnBoard([4,9]), '[4,9] is not on board');
    ok(!isOnBoard([1,0]), '[1,0] is not on board');
});

module( 'bishop moves', {
    setup: function() {
        newGame = game();
        unblockedPos = game('4k3/8/8/8/3B4/8/8/3K4');
        blockedPos = game('8/8/1r6/8/3B4/8/8/8');
    }
});

test('test no legal bishop moves when blocked on init position', function () {
    deepEqual(newGame.getMoves("c1"), [], "no legal moves on square c3");
    deepEqual(newGame.getMoves("f1"), [], "no legal moves on square c3");
    deepEqual(newGame.getMoves("c8"), [], "no legal moves on square c3");
    deepEqual(newGame.getMoves("f8"), [], "no legal moves on square c3");
});

test('test legal moves non-blocked bishop on d4', function () {
    var legalMoves = ['a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8',
                      'g1', 'f2', 'e3', 'c5', 'b6', 'a7'];
    var calculatedMoves = unblockedPos.getMoves('d4');
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "bishop moves");
});

test('test bishop can move to square of opposing piece', function () {
    var calculatedMoves = blockedPos.getMoves('d4');
    ok(jQuery.inArray('b6', calculatedMoves) > -1, 'square of opposing piece (b6) in bishop moves from d4');
});

test('test bishop can not move past square of opposing piece', function () {
    var calculatedMoves = blockedPos.getMoves('d4');
    ok(jQuery.inArray('a7', calculatedMoves) === -1, 'square past opposing piece (a7) not in bishop moves from d4');
});

module( 'rook moves', {
    setup: function() {
        newGame = game();
        unblockedPos = game('8/8/8/8/3R4/8/8/8');
        blockedPos = game('8/8/3b4/8/3R4/8/3N4/8');
    }
});

test('test no legal rook moves when blocked on init position', function () {
    deepEqual(newGame.getMoves("a1"), [], "no legal moves on square c3");
    deepEqual(newGame.getMoves("h1"), [], "no legal moves on square c3");
    deepEqual(newGame.getMoves("a8"), [], "no legal moves on square c3");
    deepEqual(newGame.getMoves("h8"), [], "no legal moves on square c3");
});

test('test legal moves non-blocked rook on d4', function () {
    var legalMoves = ['d5', 'd6', 'd7', 'd8', 'e4', 'f4', 'g4', 'h4',
                      'd3', 'd2', 'd1', 'c4', 'b4', 'a4'];
    var calculatedMoves = unblockedPos.getMoves('d4');
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "unblocked rook moves");
});

test('test rook can move to square of opposing piece', function () {
    var calculatedMoves = blockedPos.getMoves('d4');
    ok(jQuery.inArray('d6', calculatedMoves) > -1, 'square of opposing piece (d6) in rook moves from d4');
});

test('test rook can not move past square of opposing piece', function () {
    var calculatedMoves = blockedPos.getMoves('d4');
    ok(jQuery.inArray('d7', calculatedMoves) === -1, 'square past opposing piece (d7) not in rook moves from d4');
});

test('test rook can not move to square of same color piece', function () {
    var calculatedMoves = blockedPos.getMoves('d4');
    ok(jQuery.inArray('d2', calculatedMoves) === -1, 'square on same color piece (d2) not in rook moves from d4');
});

module( 'queen moves', {
    setup: function() {
        newGame = game();
        blockedPos = game('8/R2N4/5r2/8/3Q4/8/3b4/8');
    }
});

test('test no legal queen moves when blocked on init position', function () {
    deepEqual(newGame.getMoves("d1"), [], "no legal moves on square d1");
    deepEqual(newGame.getMoves("d8"), [], "no legal moves on square d8");
});

test('test blocking/non-blocking queen moves', function () {
    var legalMoves = ['a1', 'b2', 'c3', 'c5', 'b6', 'e3', 'f2', 'g1', 'e5', 'f6',
                      'd5', 'd6', 'e4', 'f4', 'g4', 'h4', 'd3', 'd2', 'c4', 'b4', 'a4'];
    var calculatedMoves =  blockedPos.getMoves('d4');
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "blocked/unblocked queen moves");
});

module( 'knight moves', {
    setup: function() {
        newGame = game();
        blockedPos = game('8/8/8/b7/8/1N6/8/2Q5');
    }
});

test('test legal knight moves on init position', function () {
    deepEqual(newGame.getMoves("b1").sort(), ['a3', 'c3'].sort(), "legal move b1 knight on init");
    deepEqual(newGame.getMoves("g1").sort(), ['f3', 'h3'].sort(), "legal move g1 knight on init");
    deepEqual(newGame.getMoves("b8").sort(), ['a6', 'c6'].sort(), "legal move b8 knight on init");
    deepEqual(newGame.getMoves("g8").sort(), ['f6', 'h6'].sort(), "legal move g8 knight on init");
});

test('test blocking/non-blocking knight moves', function () {
    var legalMoves = ['c5', 'd4','d2', 'a1', 'a5'];
    var calculatedMoves =  blockedPos.getMoves('b3');
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "blocked/unblocked knight moves");
});

module( 'king moves', {
    setup: function() {
        newGame = game();
        blockedPos = game('8/8/8/8/1N6/k7/1b6/8');
    }
});

test('test no legal king moves on init position', function () {
    deepEqual(newGame.getMoves("e1"), [], "no legal moves on square e1");
    deepEqual(newGame.getMoves("e8"), [], "no legal moves on square e8");
});

test('test blocking/non-blocking king moves', function () {
    var legalMoves = ['a4', 'b4','b3', 'a2'];
    var calculatedMoves =  blockedPos.getMoves('a3');
    deepEqual(calculatedMoves.sort(), legalMoves.sort(), "blocked/unblocked king moves");
});

module( 'pawn moves', {
    setup: function() {
        newGame = game();
        //blocked f pawns, and d pawn blocked on 4th/5th rank 
        blockedPos = game('rnbqk2r/pppppp1p/5Np1/3B4/3b4/5nP1/PPPPPP1P/RNBQK2R');
    }
});

test('test pawn can one square forward to empty square', function() {
    ok(newGame.getMoves("e2").indexOf('e3') > -1, "white e2 pawn can move to empty e3");
    ok(newGame.getMoves("e7").indexOf('e6') > -1, "black e7 pawn can move to empty e6");
});

test('test pawn on init position can move two forward to empty square', function() {
    ok(newGame.getMoves("e2").indexOf('e4') > -1, "white e2 pawn can move to empty e4");
    ok(newGame.getMoves("e7").indexOf('e5') > -1, "black e7 pawn can move to empty e5");
});

test('test pawn on init position cannot move forward one square if blocked', function() {
    equal(blockedPos.getMoves("f2").indexOf('f3'), -1, "white f2 pawn cannot move to blocked f3");
    equal(blockedPos.getMoves("f7").indexOf('f6'), -1, "black e7 pawn cannot move to blocked f6");
});

test('test pawn on init position cannot move forward two square if blocked', function() {
    equal(blockedPos.getMoves("d2").indexOf('d4'), -1, "white d2 pawn cannot move to blocked d4");
    equal(blockedPos.getMoves("d7").indexOf('d5'), -1, "black d7 pawn cannot move to blocked d5");
    equal(blockedPos.getMoves("f2").indexOf('f4'), -1, "white f2 pawn cannot move to f4 when f3 is blocked");
    equal(blockedPos.getMoves("f7").indexOf('f5'), -1, "black f7 pawn cannot move to f5 when f6 is blocked");
});

test('test pawn can capture opposing piece on diagonal neighbours in front of pawn', function() {
    ok(blockedPos.getMoves("e2").indexOf('f3') > -1, "white e2 can capture f3 opposing piece");
    ok(blockedPos.getMoves("e7").indexOf('f6') > -1, "black e2 can capture f6 opposing piece");
});

test('test pawn cannot move to diagonal neighbours when no opposing piece', function() {
    equal(blockedPos.getMoves("e2").indexOf('d3'), -1, "white e2 cannot move to empty d3");
    equal(blockedPos.getMoves("e7").indexOf('d6'), -1, "black e2 cannot move to empty d6");
});

test('test pawn cannot move to diagonal neighbours when occupied of same color piece', function() {
    equal(blockedPos.getMoves("h2").indexOf('g3'), -1, "white h2 cannot move to occupied g3");
    equal(blockedPos.getMoves("h7").indexOf('g6'), -1, "black h2 cannot move to occupied g6");
});
