/**
 * Takes a set from the board being validated as an argument.
 * Returns false if the set contains more than one of any one
 * of the possible characters ('1' - '9'). Otherwise, returns true.
 * @param {character[][]} set
 * @returns {boolean}
 */
const validateSet = (set) => {
	let characterCounts = Array(10).fill(0);
	for (const n in set) {
		if (set[n] === '.') continue;
		if (++characterCounts[parseInt(set[n])] > 1) return false;
	}
	return true;
};

/**
 * Get columns from the sudoku grid.
 * @param {character[][]} board
 * @param {int} n
 * @returns {character[]}
 */
const getCol = (board, n) => board.map((x) => x[n]);

/**
 * Gets the 3x3 sub-grids to be validated with validateSet.
 * @param {character[][]} board
 * @returns {character[][]}
 */
const getGrid = (board, x, y) =>
	board
		.slice((y % 3) * 3, (y % 3) * 3 + 3)
		.map((row) => row.slice((x % 3) * 3, (x % 3) * 3 + 3));

/**
 * Validates all rows, then cols, and then 3x3 sub-grids.
 * @param {character[][]} board
 * @returns {boolean}
 */
const validateBoard = (board) => {
	for (let i = 0; i < board.length; i++) {
		if (!validateSet(board[i])) return false; // * validate rows
		if (!validateSet(getCol(board, i))) return false; // * validate cols
	}
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (!validateSet(getGrid(board, x, y).flat())) return false;
		}
		return true;
	}
};

/**
 * Returns all empty indices in the sudoku grid. The value
 * of each index in the returned array is used to determine
 * the position being worked in the backtrack algorithm.
 * @param {character[][]} board
 * @returns {int[]}
 */
const emptyIndices = (board) => {
	const flat = board.flat();
	let indices = [],
		i = -1;
	while ((i = flat.indexOf('.', i + 1)) !== -1) indices.push(i);
	return indices;
};

/**
 * Recursive backtrack algo for solving the sudoku grid. Takes
 * an unsolved sudoku board, the empty indices in that board as an array,
 * and an integer corresponding to the current empty index being worked.
 * @param {character[][]} board
 * @param {int[]} empty
 * @param {int} i
 * @returns {boolean}
 */
const backtrack = (board, empty, i) => {
	const pos = empty[i];
	const row = Math.floor(pos / 9);
	const col = pos % 9;

	for (let x = 1; x <= 9; x++) {
		board[row][col] = x.toString();
		if (validateBoard(board)) {
			if (i === empty.length - 1 || backtrack(board, empty, i + 1)) return true;
		}
	}

	board[row][col] = '.';
	return false;
};

/**
 * Solves the sudoku board using the backtrack algorithm.
 * @param {character[][]} board
 * @returns {void} Do not return anything, modify board in-place instead.
 */
const solveSudoku = (board) => {
	const empty = emptyIndices(board);
	backtrack(board, empty, 0);
};
