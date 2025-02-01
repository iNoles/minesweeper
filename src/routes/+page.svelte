<script lang="ts">
    import { type Grid, createGrid } from "../routes/GameState";
  
    const rows = 10;
    const cols = 10;
    const mineCount = 15;
  
    let grid: Grid = createGrid(rows, cols, mineCount);
    let gameOver = false;
    let gameWon = false;
  
    // Reveal a cell
    function revealCell(row: number, col: number): void {
      if (gameOver || grid[row][col].isRevealed || grid[row][col].isFlagged) return;
  
      grid[row][col].isRevealed = true;
  
      if (grid[row][col].isMine) {
        gameOver = true;
        alert("Game Over! You clicked on a mine!");
      } else if (grid[row][col].adjacentMines === 0) {
        revealAdjacentCells(row, col);
      }
  
      checkWin();
    }
  
    // Reveal adjacent cells recursively
    function revealAdjacentCells(row: number, col: number): void {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1],
      ];
  
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
  
        if (grid[newRow]?.[newCol] && !grid[newRow][newCol].isRevealed && !grid[newRow][newCol].isMine) {
          revealCell(newRow, newCol);
        }
      }
    }
  
    // Flag or unflag a cell
    function toggleFlag(row: number, col: number): void {
      if (!grid[row][col].isRevealed) {
        grid[row][col].isFlagged = !grid[row][col].isFlagged;
      }
    }
  
    // Check if the player has won
    function checkWin(): void {
      const allNonMinesRevealed = grid.every(row =>
        row.every(cell => cell.isMine || cell.isRevealed)
      );
      if (allNonMinesRevealed) {
        gameWon = true;
        alert("You won!");
      }
    }
  </script>

  <div class="flex flex-col items-center justify-center min-h-screen">
    <header class="text-center py-4">
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Minesweeper</h1>
    </header>
  
    <div class="board">
      {#each grid as row, rowIndex}
        {#each row as cell, colIndex}
          <button
            class="cell {cell.isRevealed ? 'revealed' : 'hidden'} {cell.isRevealed && cell.isMine ? 'mine' : ''} {cell.isFlagged ? 'flagged' : ''}"
            on:click={() => revealCell(rowIndex, colIndex)}
            on:contextmenu|preventDefault={() => toggleFlag(rowIndex, colIndex)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') revealCell(rowIndex, colIndex);
              if (e.key === 'f') toggleFlag(rowIndex, colIndex);
            }}
          >
            {#if cell.isRevealed}
              {cell.isMine ? '💣' : cell.adjacentMines || ''}
            {/if}
          </button>
        {/each}
      {/each}
    </div>    
  </div>
  