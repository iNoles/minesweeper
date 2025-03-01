<script lang="ts">
	import { type Grid, createGrid } from '../routes/GameState';
	import { Bomb, Flag, XCircle } from 'lucide-svelte';

	const rows = 10;
	const cols = 10;
	const mineCount = 15;

	let grid: Grid = createGrid(rows, cols, mineCount);
	let gameOver = false;
	let gameWon = false;

	let longPressTimer: number | null = null;

	// Reveal a cell
	function revealCell(row: number, col: number): void {
		if (gameOver || gameWon || grid[row][col].isRevealed || grid[row][col].isFlagged) return;

		grid[row][col].isRevealed = true;

		if (grid[row][col].isMine) {
			gameOver = true;
			alert('Game Over! You clicked on a mine!');

			// Reveal all mines and mark incorrect flags
			grid.forEach((row) =>
				row.forEach((cell) => {
					if (cell.isMine) cell.isRevealed = true;
					if (cell.isFlagged && !cell.isMine) cell.isWrongFlag = true; // Mark incorrect flags
				})
			);
		} else if (grid[row][col].adjacentMines === 0) {
			revealAdjacentCells(row, col);
		}

		checkWin();
	}

	// Reveal adjacent cells recursively
	function revealAdjacentCells(row: number, col: number): void {
		const directions = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1]
		];

		for (const [dx, dy] of directions) {
			const newRow = row + dx;
			const newCol = col + dy;

			if (
				grid[newRow]?.[newCol] &&
				!grid[newRow][newCol].isRevealed &&
				!grid[newRow][newCol].isMine
			) {
				grid[newRow][newCol].isRevealed = true; // Mark as revealed before recursion
				if (grid[newRow][newCol].adjacentMines === 0) {
					revealAdjacentCells(newRow, newCol);
				}
			}
		}
	}

	// Flag or unflag a cell
	function toggleFlag(row: number, col: number): void {
		if (gameWon || grid[row][col].isRevealed) return;

		const newFlagState = !grid[row][col].isFlagged;

		grid[row][col] = {
			...grid[row][col],
			isFlagged: newFlagState,
			isWrongFlag: newFlagState && !grid[row][col].isMine // Mark wrong flag if it's a mistake
		};
	}

	// Handle long-press flagging on mobile & mouse
	function handleLongPress(row: number, col: number) {
		longPressTimer = setTimeout(() => {
			toggleFlag(row, col);
		}, 500); // 500ms long-press to flag
	}

	function cancelLongPress() {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null; // Reset the timer
		}
	}

	// Check if the player has won
	function checkWin(): void {
		const allNonMinesRevealed = grid.every((row) =>
			row.every((cell) => cell.isMine || cell.isRevealed)
		);

		if (allNonMinesRevealed) {
			gameWon = true;
			alert('You won!');
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<header class="py-4 text-center">
		<h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Minesweeper</h1>
	</header>

	<div class="board">
		{#each grid as row, rowIndex}
			{#each row as cell, colIndex}
				<button
					class="cell {cell.isRevealed ? 'revealed' : 'hidden'} {cell.isRevealed && cell.isMine
						? 'mine'
						: ''} {cell.isFlagged ? 'flagged' : ''}"
					on:click={() => !gameOver && !gameWon && revealCell(rowIndex, colIndex)}
					on:contextmenu|preventDefault={() =>
						!gameOver && !gameWon && toggleFlag(rowIndex, colIndex)}
					on:touchstart={() => !gameOver && !gameWon && handleLongPress(rowIndex, colIndex)}
					on:touchend={cancelLongPress}
				>
					{#if cell.isRevealed}
						{#if cell.isMine}
							<Bomb size={20} class="text-black" />
						{:else}
							{cell.adjacentMines || ''}
						{/if}
					{:else if cell.isWrongFlag}
						<XCircle size={20} class="text-red-500" />
					{:else if cell.isFlagged}
						<Flag size={20} class="text-red-500" />
					{/if}
				</button>
			{/each}
		{/each}
	</div>
</div>
