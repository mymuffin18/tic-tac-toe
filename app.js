const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const cellSize = 100;
const winLabel = document.getElementById('win-label');

const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('previous-button');
const resetButton = document.getElementById('reset-button');
const buttonsDiv = document.querySelector('.buttons');

let win = false;

let map = [
	['', '', ''],
	['', '', ''],
	['', '', ''],
];

let mapState = [];

let mapStatePointer = -1;

let currentPlayer = 'X';

let mouse = {
	x: -1,
	y: -1,
};

buttonsDiv.classList.toggle('hide');
nextButton.disabled = true;
canvas.width = 3 * cellSize;
canvas.height = 3 * cellSize;

canvas.addEventListener('mouseout', (e) => {
	mouse.x = -1;
	mouse.y = -1;
});

canvas.addEventListener('mousemove', (e) => {
	let x = e.pageX - canvas.offsetLeft,
		y = e.pageY - canvas.offsetTop;

	mouse.x = x;
	mouse.y = y;
});

canvas.addEventListener('click', (e) => {
	let coord = getCellByCoords(mouse.x, mouse.y);
	if (!win) {
		play(coord);
	}
});

function saveHistory(arr) {
	mapState.push(arr);
	console.log(mapState);
}

function play(coord) {
	if (map[coord.y][coord.x] !== '') {
		console.log('position taken');
		return;
	}

	map[coord.y][coord.x] = currentPlayer;
	let firstLayer = [];
	let secondLayer = [];
	let thirdLayer = [];

	firstLayer.push(map[0][0]);
	firstLayer.push(map[0][1]);
	firstLayer.push(map[0][2]);
	secondLayer.push(map[1][0]);
	secondLayer.push(map[1][1]);
	secondLayer.push(map[1][2]);
	thirdLayer.push(map[2][0]);
	thirdLayer.push(map[2][1]);
	thirdLayer.push(map[2][2]);

	let tmp = [[...firstLayer], [...secondLayer], [...thirdLayer]];

	mapState.push(tmp);
	mapStatePointer++;
	console.log(mapStatePointer);
	winPatterns(map);

	checkIfNoOneWins(map);

	if (currentPlayer === 'X') {
		currentPlayer = 'O';
	} else {
		currentPlayer = 'X';
	}
}

// FINALLY OK NA
prevButton.addEventListener('click', (e) => {
	mapStatePointer--;
	console.log(mapStatePointer);
	map = mapState[mapStatePointer];
	if (mapStatePointer <= 0) {
		prevButton.disabled = true;
	} else {
		prevButton.disabled = false;
	}
	if (mapStatePointer < mapState.length - 1) {
		nextButton.disabled = false;
	} else {
		nextButton.disabled = true;
	}
});

nextButton.addEventListener('click', (e) => {
	mapStatePointer++;
	map = mapState[mapStatePointer];
	console.log(mapStatePointer);
	if (mapStatePointer < mapState.length - 1) {
		nextButton.disabled = false;
	} else {
		nextButton.disabled = true;
	}
	if (mapStatePointer <= 0) {
		prevButton.disabled = true;
	} else {
		prevButton.disabled = false;
	}
});

resetButton.addEventListener('click', (e) => {
	reset();
});

function reset() {
	map = [
		['', '', ''],
		['', '', ''],
		['', '', ''],
	];
	mapState = [];
	mapStatePointer = -1;
	currentPlayer = 'X';
	buttonsDiv.classList.add('hide');
	nextButton.disabled = true;
	winLabel.textContent = '';
	win = false;
}

function winPatterns(arr) {
	horizontalSearch(arr);
	verticalSearch(arr);
	diagonalSearch(arr);
}

function horizontalSearch(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].every((element) => element === 'X')) {
			winLabel.textContent = 'Player 1 wins!';
			win = true;
			buttonsDiv.classList.toggle('hide');
		} else if (arr[i].every((element) => element === 'O')) {
			winLabel.textContent = 'Player 2 wins!';
			win = true;
			buttonsDiv.classList.toggle('hide');
		}
	}
}
function genHorizontalSearch(arr) {
	if (arr.every((element) => element === 'X')) {
		winLabel.textContent = 'Player 1 wins!';
		win = true;
		buttonsDiv.classList.toggle('hide');
	} else if (arr.every((element) => element === 'O')) {
		winLabel.textContent = 'Player 2 wins!';
		win = true;
		buttonsDiv.classList.toggle('hide');
	}
}

function verticalSearch(arr) {
	for (let i = 0; i < arr.length; i++) {
		let tmpArr = [];
		for (let j = 0; j < arr.length; j++) {
			tmpArr.push(arr[j][i]);
		}
		genHorizontalSearch(tmpArr);
	}
}

function diagonalSearch(arr) {
	let tmpArr1 = [];
	// forward diagonal search
	for (let i = 0; i < arr.length; i++) {
		tmpArr1.push(arr[i][i]);
	}
	genHorizontalSearch(tmpArr1);
	// reverse diagonal search
	let tmpArr2 = [];
	let counter = arr.length - 1;
	for (let i = 0; i < arr.length; i++) {
		tmpArr2.push(arr[i][counter]);
		counter--;
	}
	genHorizontalSearch(tmpArr2);
}

function checkIfNoOneWins(arr) {
	if (
		arr[0].every((element) => element !== '') &&
		arr[1].every((element) => element !== '') &&
		arr[2].every((element) => element !== '')
	) {
		winLabel.textContent = 'No one wins :(';
		win = true;
		buttonsDiv.classList.toggle('hide');
	}
	return;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBoard();
	fillBoard();
	function drawBoard() {
		ctx.fillStyle = '#333';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 10;

		drawLine(cellSize, 0, cellSize, canvas.height);
		drawLine(cellSize * 2, 0, cellSize * 2, canvas.height);
		drawLine(0, cellSize, canvas.width, cellSize);
		drawLine(0, cellSize * 2, canvas.width, cellSize * 2);
	}

	function fillBoard() {
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 10;
		// ROW
		for (let i = 0; i < map.length; i++) {
			// COL
			for (let j = 0; j < map.length; j++) {
				let coords = getCellCoords(i, j);

				ctx.save();
				ctx.translate(
					coords.x + cellSize / 2,
					coords.y + cellSize / 2
				);

				if (map[i][j] === 'X') {
					drawX();
				} else if (map[i][j] === 'O') {
					drawO();
				}

				ctx.restore();
			}
		}
	}

	function drawX() {
		ctx.strokeStyle = 'red';
		ctx.beginPath();
		ctx.moveTo(-cellSize / 3, -cellSize / 3);
		ctx.lineTo(cellSize / 3, cellSize / 3);
		ctx.moveTo(cellSize / 3, -cellSize / 3);
		ctx.lineTo(-cellSize / 3, cellSize / 3);
		ctx.stroke();
	}

	function drawO() {
		ctx.beginPath();
		ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2);
		ctx.stroke();
	}

	requestAnimationFrame(draw);
}

function getCellCoords(col, row) {
	let x = row * cellSize,
		y = col * cellSize;

	return {
		x: x,
		y: y,
	};
}

function getCellByCoords(x, y) {
	return {
		x: Math.floor(x / cellSize),
		y: Math.floor(y / cellSize),
	};
}

function drawLine(x, y, width, height) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(width, height);
	ctx.stroke();
}

// mapState.push(map);
draw();
