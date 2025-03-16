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
  
	function revealCell(row: number, col: number): void {
	  if (gameOver || gameWon) return; // Prevent clicks after game over
	  if (grid[row][col].isRevealed || grid[row][col].isFlagged) return;
  
	  grid[row][col].isRevealed = true;
  
	  if (grid[row][col].isMine) {
		gameOver = true;
		alert('Game Over! You clicked on a mine!');
		
		grid.forEach(row =>
		  row.forEach(cell => {
			if (cell.isMine) {
			  cell.isRevealed = true;
			} else if (cell.isFlagged && !cell.isMine) {
			  cell.isWrongFlag = true;
			}
		  })
		);
	  } else if (grid[row][col].adjacentMines === 0) {
		revealAdjacentCells(row, col);
	  }
	}
  
	function revealAdjacentCells(row: number, col: number): void {
	  const directions = [
		[-1, -1], [-1, 0], [-1, 1],
		[0, -1],         [0, 1],
		[1, -1], [1, 0], [1, 1]
	  ];
  
	  for (const [dx, dy] of directions) {
		const newRow = row + dx;
		const newCol = col + dy;
  
		if (grid[newRow]?.[newCol] && !grid[newRow][newCol].isRevealed && !grid[newRow][newCol].isMine) {
		  grid[newRow][newCol].isRevealed = true;
		  if (grid[newRow][newCol].adjacentMines === 0) {
			revealAdjacentCells(newRow, newCol);
		  }
		}
	  }
	}
  
	function toggleFlag(row: number, col: number): void {
	  if (gameOver || gameWon) return; // Prevent flagging after game over
	  if (grid[row][col].isRevealed) return;
  
	  grid[row][col].isFlagged = !grid[row][col].isFlagged;
	}
  
	function handleLongPress(row: number, col: number) {
	  if (gameOver || gameWon) return; // Prevent long-press after game over
	  longPressTimer = setTimeout(() => {
		toggleFlag(row, col);
	  }, 500);
	}
  
	function cancelLongPress() {
	  if (longPressTimer) {
		clearTimeout(longPressTimer);
		longPressTimer = null;
	  }
	}
  
	function resetGame() {
	  grid = createGrid(rows, cols, mineCount);
	  gameOver = false;
	  gameWon = false;
	}
  </script>
  
  <div class="flex min-h-screen flex-col items-center justify-center">
	<header class="py-4 text-center">
	  <h1 class="text-3xl font-bold text-neutral-900">Minesweeper</h1>
	</header>
  
	<div class="board">
	  {#each grid as row, rowIndex}
		{#each row as cell, colIndex}
		  <button
			class="cell {cell.isRevealed ? 'revealed' : 'hidden'} {cell.isRevealed && cell.isMine
			  ? 'mine'
			  : ''} {cell.isFlagged ? 'flagged' : ''}"
			on:click={() => revealCell(rowIndex, colIndex)}
			on:contextmenu|preventDefault={() => toggleFlag(rowIndex, colIndex)}
			on:touchstart={() => handleLongPress(rowIndex, colIndex)}
			on:touchend={cancelLongPress}
		  >
			{#if cell.isRevealed}
			  {#if cell.isMine}
				<Bomb size={20} class="text-black" />
			  {:else}
				{cell.adjacentMines || ''}
			  {/if}
			{:else if gameOver && cell.isWrongFlag}
			  <XCircle size={20} class="text-red-500" />
			{:else if cell.isFlagged}
			  <Flag size={20} class="text-red-500" />
			{/if}
		  </button>
		{/each}
	  {/each}
	</div>

	<button class="mb-4 px-4 py-2 bg-blue-500 text-white rounded" on:click={resetGame}>
		Reset Game
	</button>
  </div>
  