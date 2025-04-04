import { writable } from 'svelte/store';

export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isWrongFlag: boolean;
  adjacentMines: number;
}

export type Grid = Cell[][];

function createGrid(rows: number, cols: number, mineCount: number): Grid {
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      isWrongFlag: false,
      adjacentMines: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!grid[r][c].isMine) {
      grid[r][c].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].isMine) {
        grid[r][c].adjacentMines = countAdjacentMines(grid, r, c);
      }
    }
  }

  return grid;
}

function countAdjacentMines(grid: Grid, row: number, col: number): number {
  const dirs = [-1, 0, 1];
  let count = 0;

  for (const dr of dirs) {
    for (const dc of dirs) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (grid[nr]?.[nc]?.isMine) count++;
    }
  }
  return count;
}

const game = (() => {
  const grid = writable(createGrid(10, 10, 15));
  const gameOver = writable(false);
  const gameWon = writable(false);
  const timer = writable(0);
  const flagsUsed = writable(0);
  let timerInterval: number | null = null;

  function startTimer() {
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        timer.update(t => t + 1);
      }, 1000);
    }
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function checkWin(grid: Grid) {
    return grid.every(row => row.every(cell => cell.isMine || cell.isRevealed));
  }

  function revealCell(row: number, col: number) {
    grid.update(g => {
      const cell = g[row][col];
      if (cell.isRevealed || cell.isFlagged) return g;

      cell.isRevealed = true;
      startTimer();

      if (cell.isMine) {
        gameOver.set(true);
        stopTimer();
        g.forEach(row => {
          row.forEach(c => {
            if (c.isMine) c.isRevealed = true;
          });
        });
      }

      if (cell.adjacentMines === 0 && !cell.isMine) {
        revealEmptyNeighbors(g, row, col);
      }

      if (checkWin(g)) {
        gameWon.set(true);
        stopTimer();
        alert("You win!");
      }

      return g;
    });
  }

  function revealEmptyNeighbors(grid: Grid, row: number, col: number) {
    const dirs = [-1, 0, 1];
    for (const dr of dirs) {
      for (const dc of dirs) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (grid[nr]?.[nc] && !grid[nr][nc].isRevealed && !grid[nr][nc].isMine) {
          grid[nr][nc].isRevealed = true;
          if (grid[nr][nc].adjacentMines === 0) {
            revealEmptyNeighbors(grid, nr, nc);
          }
        }
      }
    }
  }

  function toggleFlag(row: number, col: number) {
    grid.update(g => {
      const cell = g[row][col];
      if (!cell.isRevealed) {
        cell.isFlagged = !cell.isFlagged;
        flagsUsed.update(f => cell.isFlagged ? f + 1 : f - 1);
      }
      return g;
    });
  }

  function resetGame() {
    grid.set(createGrid(10, 10, 15));
    gameOver.set(false);
    gameWon.set(false);
    timer.set(0);
    flagsUsed.set(0);
    stopTimer();
  }

  return { grid, gameOver, gameWon, timer, flagsUsed, revealCell, toggleFlag, resetGame };
})();

export { game };
