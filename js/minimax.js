
function isBoardFull() {
	for (let i = 0; i < 5; i += 1) {
		for (let j = 0; j < 5; j += 1) {
			if (board[i][j] == '') return false;
		}
	}
	return true;
}

function randomMove() {
	let i = 0;
	let j = 0;
	do {
		i = Math.floor(Math.random() * 5);
		j = Math.floor(Math.random() * 5);
	} while (board[i][j] != '');
	board[i][j] = a;
}

function bestMove() {
	if (checkWinner() !== null) return;
	if (isBoardFull()) return;
	const moveLevel = Math.floor(Math.random() * 5) + 1;
	if (moveLevel > level) {
		randomMove();
		currentPlayer = h;
		return;
	}
	let bestScore = -Infinity;
	let possibilities = [];
	for (let i = 0; i < 5; i += 1) {
		for (let j = 0; j < 5; j += 1) {
			if (board[i][j] == '') {
				board[i][j] = a;
				let score = minimax(board, 0, false);
				board[i][j] = '';
				if (score > bestScore) {
					bestScore = score;
					possibilities = [];
					possibilities.push({ i: i, j: j });
				} else if (score == bestScore) {
					possibilities.push({ i: i, j: j });
				}
			}
		}
	}
	let move = possibilities[Math.floor(Math.random() * possibilities.length)];
	board[move.i][move.j] = a;
	currentPlayer = h;
}

function minimax(board, depth, isMaximizing) {
	const scores = { X: 1, O: -1, T: 0 };
	let result = checkWinner();
	if (result !== null) return scores[result];
	if (depth == 3) return 0;
	let bestScore;
	if (isMaximizing) {
		bestScore = -Infinity;
		for (let i = 0; i < 5; i += 1) {
			for (let j = 0; j < 5; j += 1) {
				if (board[i][j] == '') {
					board[i][j] = a;
					let score = minimax(board, depth + 1, false);
					board[i][j] = '';
					bestScore = max(score, bestScore);
				}
			}
		}
	} else {
		bestScore = Infinity;
		for (let i = 0; i < 5; i += 1) {
			for (let j = 0; j < 5; j += 1) {
				if (board[i][j] == '') {
					board[i][j] = h;
					let score = minimax(board, depth + 1, true);
					board[i][j] = '';
					bestScore = min(score, bestScore);
				}
			}
		}
	}
	return bestScore;
}
