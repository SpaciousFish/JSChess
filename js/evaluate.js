var RookOpenFile = 10;
var RookSemiOpenFile = 5;
var QueenOpenFile = 5;
var QueenSemiOpenFile = 3;
var BishopPair = 30;

var PawnRanksWhite = new Array(10);
var PawnRanksBlack = new Array(10);

var PawnIsolated = -10;
var PawnPassed = [0, 5, 10, 20, 35, 60, 100, 200];

var PawnTable = [
	0, 0, 0, 0, 0, 0, 0, 0,
	10, 10, 0, -10, -10, 0, 10, 10,
	5, 0, 0, 5, 5, 0, 0, 5,
	0, 0, 10, 20, 20, 10, 0, 0,
	5, 5, 5, 10, 10, 5, 5, 5,
	10, 10, 10, 20, 20, 10, 10, 10,
	20, 20, 20, 30, 30, 20, 20, 20,
	0, 0, 0, 0, 0, 0, 0, 0
];

var KnightTable = [
	0, -10, 0, 0, 0, 0, -10, 0,
	0, 0, 0, 5, 5, 0, 0, 0,
	0, 0, 10, 10, 10, 10, 0, 0,
	0, 0, 10, 20, 20, 10, 5, 0,
	5, 10, 15, 20, 20, 15, 10, 5,
	5, 10, 10, 20, 20, 10, 10, 5,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0
];

var BishopTable = [
	0, 0, -10, 0, 0, -10, 0, 0,
	0, 0, 0, 10, 10, 0, 0, 0,
	0, 0, 10, 15, 15, 10, 0, 0,
	0, 10, 15, 20, 20, 15, 10, 0,
	0, 10, 15, 20, 20, 15, 10, 0,
	0, 0, 10, 15, 15, 10, 0, 0,
	0, 0, 0, 10, 10, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0
];

var RookTable = [
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	25, 25, 25, 25, 25, 25, 25, 25,
	0, 0, 5, 10, 10, 5, 0, 0
];

var KingE = [
	-50, -10, 0, 0, 0, 0, -10, -50,
	-10, 0, 10, 10, 10, 10, 0, -10,
	0, 10, 20, 20, 20, 20, 10, 0,
	0, 10, 20, 40, 40, 20, 10, 0,
	0, 10, 20, 40, 40, 20, 10, 0,
	0, 10, 20, 20, 20, 20, 10, 0,
	-10, 0, 10, 10, 10, 10, 0, -10,
	-50, -10, 0, 0, 0, 0, -10, -50
];

var KingO = [
	0, 5, 5, -10, -10, 0, 10, 5,
	-30, -30, -30, -30, -30, -30, -30, -30,
	-50, -50, -50, -50, -50, -50, -50, -50,
	-70, -70, -70, -70, -70, -70, -70, -70,
	-70, -70, -70, -70, -70, -70, -70, -70,
	-70, -70, -70, -70, -70, -70, -70, -70,
	-70, -70, -70, -70, -70, -70, -70, -70,
	-70, -70, -70, -70, -70, -70, -70, -70
];

var ENDGAME_MAT = 1 * PieceVal[PIECES.wR] + 2 * PieceVal[PIECES.wN] + 2 * PieceVal[PIECES.wP] + PieceVal[PIECES.wK];

function PawnsInit() {
	var index = 0;

	for (index = 0; index < 10; ++index) {
		PawnRanksWhite[index] = RANKS.RANK_8;
		PawnRanksBlack[index] = RANKS.RANK_1;
	}

	pce = PIECES.wP;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		if (RanksBrd[sq] < PawnRanksWhite[FilesBrd[sq] + 1]) {
			PawnRanksWhite[FilesBrd[sq] + 1] = RanksBrd[sq];
		}
	}

	pce = PIECES.bP;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		if (RanksBrd[sq] > PawnRanksBlack[FilesBrd[sq] + 1]) {
			PawnRanksBlack[FilesBrd[sq] + 1] = RanksBrd[sq];
		}
	}
}

function EvalPosition() {

	var pce;
	var sq;
	var pceNum;
	var score = GameBoard.material[COLOURS.WHITE] - GameBoard.material[COLOURS.BLACK];
	var file;
	var rank;
	if (0 == GameBoard.pceNum[PIECES.wP] && 0 == GameBoard.pceNum[PIECES.bP] && DrawMaterial() == BOOL.TRUE) {
		return 0;
	}

	PawnsInit();

	pce = PIECES.wP;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += PawnTable[SQ64(sq)];
		file = FilesBrd[sq] + 1;
		rank = RanksBrd[sq];
		if (PawnRanksWhite[file - 1] == RANKS.RANK_8 && PawnRanksWhite[file + 1] == RANKS.RANK_8) {
			score += PawnIsolated;
		}

		if (PawnRanksBlack[file - 1] <= rank && PawnRanksBlack[file] <= rank && PawnRanksBlack[file + 1] <= rank) {
			score += PawnPassed[rank];
		}
	}

	pce = PIECES.bP;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= PawnTable[MIRROR64(SQ64(sq))];
		file = FilesBrd[sq] + 1;
		rank = RanksBrd[sq];
		if (PawnRanksBlack[file - 1] == RANKS.RANK_1 && PawnRanksBlack[file + 1] == RANKS.RANK_1) {
			score -= PawnIsolated;
		}

		if (PawnRanksWhite[file - 1] >= rank && PawnRanksWhite[file] >= rank && PawnRanksWhite[file + 1] >= rank) {
			score -= PawnPassed[7 - rank];
		}
	}

	pce = PIECES.wN;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += KnightTable[SQ64(sq)];
	}

	pce = PIECES.bN;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
	}

	pce = PIECES.wB;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += BishopTable[SQ64(sq)];
	}

	pce = PIECES.bB;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= BishopTable[MIRROR64(SQ64(sq))];
	}

	pce = PIECES.wR;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += RookTable[SQ64(sq)];
		file = FilesBrd[sq] + 1;
		if (PawnRanksWhite[file] == RANKS.RANK_8) {
			if (PawnRanksBlack[file] == RANKS.RANK_1) {
				score += RookOpenFile;
			} else {
				score += RookSemiOpenFile;
			}
		}
	}

	pce = PIECES.bR;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
		file = FilesBrd[sq] + 1;
		if (PawnRanksBlack[file] == RANKS.RANK_1) {
			if (PawnRanksWhite[file] == RANKS.RANK_8) {
				score -= RookOpenFile;
			} else {
				score -= RookSemiOpenFile;
			}
		}
	}

	pce = PIECES.wQ;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += RookTable[SQ64(sq)];
		file = FilesBrd[sq] + 1;
		if (PawnRanksWhite[file] == RANKS.RANK_8) {
			if (PawnRanksBlack[file] == RANKS.RANK_1) {
				score += QueenOpenFile;
			} else {
				score += QueenSemiOpenFile;
			}
		}
	}

	pce = PIECES.bQ;
	for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
		file = FilesBrd[sq] + 1;
		if (PawnRanksBlack[file] == RANKS.RANK_1) {
			if (PawnRanksWhite[file] == RANKS.RANK_8) {
				score -= QueenOpenFile;
			} else {
				score -= QueenSemiOpenFile;
			}
		}
	}

	pce = PIECES.wK;
	sq = GameBoard.pList[PCEINDEX(pce, 0)];

	if ((GameBoard.material[COLOURS.BLACK] <= ENDGAME_MAT)) {
		score += KingE[SQ64(sq)];
	} else {
		score += KingO[SQ64(sq)];
	}

	pce = PIECES.bK;
	sq = GameBoard.pList[PCEINDEX(pce, 0)];

	if ((GameBoard.material[COLOURS.WHITE] <= ENDGAME_MAT)) {
		score -= KingE[MIRROR64(SQ64(sq))];
	} else {
		score -= KingO[MIRROR64(SQ64(sq))];
	}

	if (GameBoard.pceNum[PIECES.wB] >= 2) {
		score += BishopPair;
	}

	if (GameBoard.pceNum[PIECES.bB] >= 2) {
		score -= BishopPair;
	}

	if (GameBoard.side == COLOURS.WHITE) {
		return score;
	} else {
		return -score;
	}

}