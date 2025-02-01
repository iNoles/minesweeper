export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export type Grid = Cell[][];

/**
 * Create a new game grid.
 * @param rows Number of rows
 * @param cols Number of columns
 * @param mineCount Number of mines
 */
export function createGrid(rows: number, cols: number, mineCount: number): Grid {
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  // Place mines randomly
  let placedMines = 0;
  while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      placedMines++;
    }
  }

  // Calculate adjacent mine counts
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].isMine) continue;
      grid[row][col].adjacentMines = countAdjacentMines(grid, row, col);
    }
  }

  return grid;
}

/**
 * Count adjacent mines for a given cell.
 * @param grid Game grid
 * @param row Cell row
 * @param col Cell column
 * @returns Number of adjacent mines
 */
function countAdjacentMines(grid: Grid, row: number, col: number): number {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  return directions.reduce((count, [dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (grid[newRow]?.[newCol]?.isMine) count++;
    return count;
  }, 0);
}
