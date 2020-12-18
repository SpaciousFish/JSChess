var MirrorFiles = [FILES.FILE_H, FILES.FILE_G, FILES.FILE_F, FILES.FILE_E, FILES.FILE_D, FILES.FILE_C, FILES.FILE_B, FILES.FILE_A];
var MirrorRanks = [RANKS.RANK_8, RANKS.RANK_7, RANKS.RANK_6, RANKS.RANK_5, RANKS.RANK_4, RANKS.RANK_3, RANKS.RANK_2, RANKS.RANK_1];

function MIRROR120(sq) {
	var file = MirrorFiles[FilesBrd[sq]];
	var rank = MirrorRanks[RanksBrd[sq]];
	return FR2SQ(file, rank);
}

$("#SetFen").click(function () {
	var fenStr = $("#fenIn").val();
	NewGame(fenStr);
	newGameAjax();
});

$('#TakeButton').click(function () {
	if (GameBoard.hisPly > 0) {
		TakeMove();
		GameBoard.ply = 0;
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
	}
});

$('#NewGameButton').click(function () {
	NewGame(START_FEN);
	newGameAjax();
});

function NewGame(fenStr) {
	ParseFen(fenStr);
	PrintBoard();
	SetInitialBoardPieces();
	CheckAndSet();
}

function newGameAjax() {
	console.log('new Game Ajax');
}

function ClearAllPieces() {
	$(".Piece").remove();
}

function SetInitialBoardPieces() {

	var sq;
	var sq120;
	var file, rank;
	var pce;

	ClearAllPieces();

	for (sq = 0; sq < 64; ++sq) {
		sq120 = SQ120(sq);
		pce = GameBoard.pieces[sq120];
		if (GameController.BoardFlipped == BOOL.TRUE) {
			sq120 = MIRROR120(sq120);
		}
		file = FilesBrd[sq120];
		rank = RanksBrd[sq120];
		if (pce >= PIECES.wP && pce <= PIECES.bK) {
			AddGUIPiece(sq120, pce);
		}
	}
}

function DeSelectSq(sq) {

	if (GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}

	$('.Square').each(function (index) {
		if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).removeClass('SqSelected');
		}
	});
}

function SetSqSelected(sq) {

	if (GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}

	$('.Square').each(function (index) {
		if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).addClass('SqSelected');
		}
	});
}

function ClickedSquare(pageX, pageY) {
	console.log('ClickedSquare() at ' + pageX + ',' + pageY);
	var position = $('#Board').position();

	var workedX = Math.floor(position.left);
	var workedY = Math.floor(position.top);

	pageX = Math.floor(pageX);
	pageY = Math.floor(pageY);

	var file = Math.floor((pageX - workedX) / 60);
	var rank = 7 - Math.floor((pageY - workedY) / 60);

	var sq = FR2SQ(file, rank);

	if (GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}

	console.log('Clicked sq:' + PrSq(sq));

	SetSqSelected(sq);

	return sq;
}

$(document).on('click', '.Piece', function (e) {
	console.log('Piece Click');

	if (UserMove.from == SQUARES.NO_SQ) {
		UserMove.from = ClickedSquare(e.pageX, e.pageY);
	} else {
		UserMove.to = ClickedSquare(e.pageX, e.pageY);
	}

	MakeUserMove();

});

$(document).on('click', '.Square', function (e) {
	console.log('Square Click');
	if (UserMove.from != SQUARES.NO_SQ) {
		UserMove.to = ClickedSquare(e.pageX, e.pageY);
		MakeUserMove();
	}

});

function MakeUserMove() {

	if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {

		console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));

		var parsed = ParseMove(UserMove.from, UserMove.to);

		if (parsed != NOMOVE) {
			MakeMove(parsed);
			PrintBoard();
			MoveGUIPiece(parsed);
			CheckAndSet();
			PreSearch();
		}

		DeSelectSq(UserMove.from);
		DeSelectSq(UserMove.to);

		UserMove.from = SQUARES.NO_SQ;
		UserMove.to = SQUARES.NO_SQ;
	}

}

function PieceIsOnSq(sq, top, left) {

	if ((RanksBrd[sq] == 7 - Math.round(top / 60)) &&
		FilesBrd[sq] == Math.round(left / 60)) {
		return BOOL.TRUE;
	}

	return BOOL.FALSE;

}

function RemoveGUIPiece(sq) {

	$('.Piece').each(function (index) {
		if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).remove();
		}
	});

}

function AddGUIPiece(sq, pce) {

	var file = FilesBrd[sq];
	var rank = RanksBrd[sq];
	var rankName = "rank" + (rank + 1);
	var fileName = "file" + (file + 1);
	var pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	var imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
	$("#Board").append(imageString);
}

function MoveGUIPiece(move) {

	var from = FROMSQ(move);
	var to = TOSQ(move);

	var flippedFrom = from;
	var flippedTo = to;
	var epWhite = -10;
	var epBlack = 10;

	if (GameController.BoardFlipped == BOOL.TRUE) {
		flippedFrom = MIRROR120(from);
		flippedTo = MIRROR120(to);
		epWhite = 10;
		epBlack = -10;
	}

	if (move & MFLAGEP) {
		var epRemove;
		if (GameBoard.side == COLOURS.BLACK) {
			epRemove = flippedTo + epWhite;
		} else {
			epRemove = flippedTo + epBlack;
		}
		RemoveGUIPiece(epRemove);
	} else if (CAPTURED(move)) {
		RemoveGUIPiece(flippedTo);
	}

	var file = FilesBrd[flippedTo];
	var rank = RanksBrd[flippedTo];
	var rankName = "rank" + (rank + 1);
	var fileName = "file" + (file + 1);

	$('.Piece').each(function (index) {
		if (PieceIsOnSq(flippedFrom, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).removeClass();
			$(this).addClass("Piece " + rankName + " " + fileName);
		}
	});

	if (move & MFLAGCA) {
		if (GameController.BoardFlipped == BOOL.TRUE) {
			switch (to) {
				case SQUARES.G1: RemoveGUIPiece(MIRROR120(SQUARES.H1)); AddGUIPiece(MIRROR120(SQUARES.F1), PIECES.wR); break;
				case SQUARES.C1: RemoveGUIPiece(MIRROR120(SQUARES.A1)); AddGUIPiece(MIRROR120(SQUARES.D1), PIECES.wR); break;
				case SQUARES.G8: RemoveGUIPiece(MIRROR120(SQUARES.H8)); AddGUIPiece(MIRROR120(SQUARES.F8), PIECES.bR); break;
				case SQUARES.C8: RemoveGUIPiece(MIRROR120(SQUARES.A8)); AddGUIPiece(MIRROR120(SQUARES.D8), PIECES.bR); break;
			}
		} else {
			switch (to) {
				case SQUARES.G1: RemoveGUIPiece(SQUARES.H1); AddGUIPiece(SQUARES.F1, PIECES.wR); break;
				case SQUARES.C1: RemoveGUIPiece(SQUARES.A1); AddGUIPiece(SQUARES.D1, PIECES.wR); break;
				case SQUARES.G8: RemoveGUIPiece(SQUARES.H8); AddGUIPiece(SQUARES.F8, PIECES.bR); break;
				case SQUARES.C8: RemoveGUIPiece(SQUARES.A8); AddGUIPiece(SQUARES.D8, PIECES.bR); break;
			}
		}
	}
	var prom = PROMOTED(move);
	console.log("PromPce:" + prom);
	if (prom != PIECES.EMPTY) {
		console.log("prom removing from " + PrSq(flippedTo));
		RemoveGUIPiece(flippedTo);
		AddGUIPiece(flippedTo, prom);
	}

}

function DrawMaterial() {

	if (GameBoard.pceNum[PIECES.wP] != 0 || GameBoard.pceNum[PIECES.bP] != 0) return BOOL.FALSE;
	if (GameBoard.pceNum[PIECES.wQ] != 0 || GameBoard.pceNum[PIECES.bQ] != 0 ||
		GameBoard.pceNum[PIECES.wR] != 0 || GameBoard.pceNum[PIECES.bR] != 0) return BOOL.FALSE;
	if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) { return BOOL.FALSE; }
	if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) { return BOOL.FALSE; }

	if (GameBoard.pceNum[PIECES.wN] != 0 && GameBoard.pceNum[PIECES.wB] != 0) { return BOOL.FALSE; }
	if (GameBoard.pceNum[PIECES.bN] != 0 && GameBoard.pceNum[PIECES.bB] != 0) { return BOOL.FALSE; }

	return BOOL.TRUE;
}

function ThreeFoldRep() {
	var i = 0, r = 0;

	for (i = 0; i < GameBoard.hisPly; ++i) {
		if (GameBoard.history[i].posKey == GameBoard.posKey) {
			r++;
		}
	}
	return r;
}

function CheckResult() {
	if (GameBoard.fiftyMove >= 100) {
		$("#GameStatus").text("GAME DRAWN {fifty move rule}");
		return BOOL.TRUE;
	}

	if (ThreeFoldRep() >= 2) {
		$("#GameStatus").text("GAME DRAWN {3-fold repetition}");
		return BOOL.TRUE;
	}

	if (DrawMaterial() == BOOL.TRUE) {
		$("#GameStatus").text("GAME DRAWN {insufficient material to mate}");
		return BOOL.TRUE;
	}

	GenerateMoves();

	var MoveNum = 0;
	var found = 0;

	for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {

		if (MakeMove(GameBoard.moveList[MoveNum]) == BOOL.FALSE) {
			continue;
		}
		found++;
		TakeMove();
		break;
	}

	$("#currentFenSpan").text(BoardToFen());

	if (found != 0) return BOOL.FALSE;

	var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side ^ 1);

	if (InCheck == BOOL.TRUE) {
		if (GameBoard.side == COLOURS.WHITE) {
			$("#GameStatus").text("GAME OVER {black mates}");
			return BOOL.TRUE;
		} else {
			$("#GameStatus").text("GAME OVER {white mates}");
			return BOOL.TRUE;
		}
	} else {
		$("#GameStatus").text("GAME DRAWN {stalemate}"); return BOOL.TRUE;
	}
}

function CheckAndSet() {
	if (CheckResult() == BOOL.TRUE) {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE; // save the game here
	} else {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');
	}
	$("#currentFenSpan").text(BoardToFen());
}

function PreSearch() {
	if (GameController.GameOver == BOOL.FALSE) {
		SearchController.thinking = BOOL.TRUE;
		$('#ThinkingImageDiv').append('<image src="images/think3.png" id="ThinkingPng"/>');
		setTimeout(function () { StartSearch(); }, 200);
	}
}

$('#SearchButton').click(function () {
	GameController.PlayerSide = GameController.side ^ 1;
	PreSearch();
});

function StartSearch() {

	SearchController.depth = MAXDEPTH;
	var tt = $('#ThinkTimeChoice').val();

	SearchController.time = parseInt(tt) * 1000;
	SearchPosition();

	MakeMove(SearchController.best);
	MoveGUIPiece(SearchController.best);
	$('#ThinkingPng').remove();
	CheckAndSet();
}

$("#FlipButton").click(function () {
	GameController.BoardFlipped ^= 1;
	console.log("Flipped:" + GameController.BoardFlipped);
	SetInitialBoardPieces();
});