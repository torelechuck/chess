test( "test board size", function() {
    var board = initGame();
    strictEqual( board.length, 8, "Board height is 8." );
    strictEqual( board[0].length, 8, "Board width is 8." );
});

test( "test correct square names", function() {
    var board = initGame();
    strictEqual( board[0][0].name, "a1", "0,0 is a1" );
    strictEqual( board[0][7].name, "h1", "0,7 is h1" );
    strictEqual( board[7][7].name, "h8", "7,7 is h8" );
    strictEqual( board[4][5].name, "f5", "4,5 is f5" );
});

test( "test pawns on rank 2 and 7", function() {
    var board = initGame();
    function checkRank(rankIdx) {
        var rank = board[rankIdx];
        for (var i = 0; i < rank.length; i++) {
            var piece = rank[i].piece;
            strictEqual(piece.type, "pawn", "pawn on " + rankIdx + "," + i)
        };
    };
    checkRank(1);
    checkRank(6);
});

test( "test bishop on file c and f", function() {
    var board = initGame();
    strictEqual(board[0][2].piece.type, "bishop", "bishop on 0,2");
    strictEqual(board[0][5].piece.type, "bishop", "bishop on 0,5");
    strictEqual(board[7][2].piece.type, "bishop", "bishop on 7,2");
    strictEqual(board[7][5].piece.type, "bishop", "bishop on 7,5");
});

test( "test empty squares on rank 3 through 6", function() {
    var board = initGame();
    for (var i = 2; i < 6; i++) {
        for(var j = 0; j < 8; j++) {
            strictEqual(board[i][j].piece, null, "Empty square on " + i + "," + j);
        }
    };
});

test( "test white pieces on rank 1 and 2", function() {
    var board = initGame();
    for (var i = 0; i < 2; i++) {
        for(var j = 0; j < 8; j++) {
            strictEqual(board[i][j].piece.color, "white", "Empty square on " + i + "," + j);   
        };
    };
});


test( "test black pieces on rank 7 and 8", function() {
    var board = initGame();
    for (var i = 6; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
            strictEqual(board[i][j].piece.color, "black", "Empty square on " + i + "," + j);   
        };
    };
});

test( "test prefixes for non-pawns", function() {
    var board = initGame();
    prefixes = ["R", "N", "B", "Q", "K", "B", "N", "R"];
    for(var i = 0; i < 8; i++){
        strictEqual(board[0][i].piece.prefix, prefixes[i], "prefix on white rank");
    };
});
