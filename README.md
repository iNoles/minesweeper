# Minesweeper Game

A fun and interactive **Minesweeper** game built with **Svelte** and **Tailwind CSS**. The game is fully responsive, with a clean design and light and dark themes. The goal is to clear the minefield without triggering any mines.

## Features

- **Responsive Design**: Works seamlessly across all devices (desktop, tablet, mobile).
- **Light & Dark Themes**: Toggle between light and dark themes for a better user experience.
- **Minefield Layout**: The game board consists of a 10x10 grid with random mines.
- **Flagging**: Flag potential mines to keep track of where they might be.
- **Prerendered Pages**: Fast loading with prerendered static pages.
- **Wrong Flag Indication**: Incorrectly placed flags are revealed after the game ends.

## Installation

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/minesweeper-game.git
   ```
2. Navigate to the project directory:
   ```bash
   cd minesweeper-game
   ```
3. Install dependencies:
  ```bash
   bun install
   ```
4. Run the development server:
   ```bash
   bun run dev
   ```

## Usage

- Click on cells to reveal them. If you click on a mine, the game ends!
- Right-click (or long press on mobile) to flag potential mines.
- Win the game by revealing all non-mine cells.
- Incorrectly placed flags are highlighted after game over.

## Technologies Used

- Svelte: A lightweight framework for building fast, interactive web apps.
- Tailwind CSS: Utility-first CSS framework for styling.
- TypeScript: Superset of JavaScript for static typing.
- Vite: Build tool that provides fast bundling.

## Contributing

Contributions are welcome! Feel free to fork the repository, create a branch, and submit a pull request.

1. Fork the repository.
2. Create a new branch (```git checkout -b feature-name```).
3. Make your changes.
4. Commit your changes (```git commit -am 'Add feature'```).
5. Push to the branch (```git push origin feature-name```).
6. Create a new Pull Request.
