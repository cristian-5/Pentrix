
const MDCSnackbar = mdc.snackbar.MDCSnackbar;

let board = [
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', '']
];

let cellW = 0;
let cellH = 0;

const a = 'X';
const h = 'O';
let currentPlayer = a;

// True if human chooses X:
let inverse = true;

// True for human first:
let starter = true;

// AI Level (1 ... 5):
let level = 3;

let canvas;

function setup() {
	canvas = createCanvas(500, 500);
	canvas.parent('container');
	cellW = width / 5;
	cellH = height / 5;
	noFill();
}

function check(a, b, c, d, e) {
	return a != '' && a == b &&
		   b == c && c == d && d == e;
}

function drawWinningLine(s, e) {
	strokeWeight(5);
	stroke('#04C68CA0');
	const y1 = s.x * cellW + cellW / 2;
	const x1 = s.y * cellH + cellH / 2;
	const y2 = e.x * cellW + cellW / 2;
	const x2 = e.y * cellH + cellH / 2;
	line(x1, y1, x2, y2);
}

function showWinner() {

	// Horizontal Cells:
	for (let i = 0; i < 5; i += 1) {
		if (check(board[i][0], board[i][1],
				  board[i][2], board[i][3],
				  board[i][4])) {
			drawWinningLine(
				{ x: 0, y: i },
				{ x: 4, y: i }
			);
			return;
		}
	}

	// Vertical Cells:
	for (let i = 0; i < 5; i += 1) {
		if (check(board[0][i], board[1][i],
				  board[2][i], board[3][i],
				  board[4][i])) {
			drawWinningLine(
				{ x: i, y: 0 },
				{ x: i, y: 4 }
			);
			return;
		}
	}

	// Diagonal Cells:
	if (check(board[0][0], board[1][1],
			  board[2][2], board[3][3],
			  board[4][4])) {
		drawWinningLine(
			{ x: 0, y: 0 },
			{ x: 4, y: 4 }
		);
		return;
	}
	if (check(board[4][0], board[3][1],
			  board[2][2], board[1][3],
			  board[0][4])) {
		drawWinningLine(
			{ x: 4, y: 0 },
			{ x: 0, y: 4 }
		);
		return;
	}

}

function checkWinner() {

	let winner = null;

	// Horizontal Cells:
	for (let i = 0; i < 5; i += 1) {
		if (check(board[i][0], board[i][1],
				  board[i][2], board[i][3],
				  board[i][4])) {
			winner = board[i][0];
		}
	}

	// Vertical Cells:
	for (let i = 0; i < 5; i += 1) {
		if (check(board[0][i], board[1][i],
				  board[2][i], board[3][i],
				  board[4][i])) {
			winner = board[0][i];
		}
	}

	// Diagonal Cells:
	if (check(board[0][0], board[1][1],
			  board[2][2], board[3][3],
			  board[4][4])) {
		winner = board[0][0];
	}
	if (check(board[4][0], board[3][1],
			  board[2][2], board[1][3],
			  board[0][4])) {
		winner = board[4][0];
	}

	let openSpots = 0;
	for (let i = 0; i < 5; i += 1) {
		for (let j = 0; j < 5; j += 1) {
			if (board[i][j] == '') {
				openSpots += 1;
			}
		}
	}

	if (winner == null && openSpots == 0) return 'T';
	else return winner;

}

function mousePressed() {
	if (currentPlayer == h) {
		let i = floor(mouseX / cellW);
		let j = floor(mouseY / cellH);
		if (i < 0 || i > 4) return;
		if (j < 0 || j > 4) return;
		if (board[i][j] == '') {
			board[i][j] = h;
			currentPlayer = a;
			bestMove();
		}
	}
}

function drawGrid() {

	background('#FFFFFF');
	stroke('#DCDCDC');
	strokeWeight(2);

	const p = 5;
	const pHeight = height - p * 2;
	const pWidth = width - p * 2;

	line(cellW, p, cellW, pHeight);
	line(cellW * 2, p, cellW * 2, pHeight);
	line(cellW * 3, p, cellW * 3, pHeight);
	line(cellW * 4, p, cellW * 4, pHeight);

	line(p, cellH, pWidth, cellH);
	line(p, cellH * 2, pWidth, cellH * 2);
	line(p, cellH * 3, pWidth, cellH * 3);
	line(p, cellH * 4, pWidth, cellH * 4);

}

function draw() {

	drawGrid();

	strokeWeight(5);

	for (let j = 0; j < 5; j += 1) {
		for (let i = 0; i < 5; i += 1) {
			let x = cellW * i + cellW / 2;
			let y = cellH * j + cellH / 2;
			let spot = board[i][j];
			if (spot == h) {
				drawCell(!inverse, x, y);
			} else if (spot == a) {
				drawCell(inverse, x, y);
			}
		}
	}

	let result = checkWinner();
	if (result != null) {
		showWinner();
		noLoop();
		const message = document.querySelector('.mdc-snackbar');
		let snack = MDCSnackbar.attachTo(message);
		if (result == 'T') snack.labelText = 'Draw!';
		else if (inverse) {
			snack.labelText = `${ result == 'X' ? 'O' : 'X' } wins!`;
		} else snack.labelText = `${result} wins!`;
		snack.open();
	}

}

function drawCell(s, x, y) {
	const r = cellW / 4;
	if (s) {
		stroke('#A45BFD');
		ellipse(x, y, r * 2);
	} else {
		stroke('#39BDD4');
		line(x - r, y - r, x + r, y + r);
		line(x + r, y - r, x - r, y + r);
	}
}

function reset() {
	inverse = $('#sign-1:checked').val() == 'on';
	starter = $('#player-2:checked').val() == 'on';
	level = $('#level').val();
	board = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];
	currentPlayer = h;
	canvas.clear();
	setup();
	if (!starter) randomMove();
	loop();
}
