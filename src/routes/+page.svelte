<script lang="ts">
	import { game } from '../stores/GameState';
	import { Bomb, Flag } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	
	let { grid, gameOver, gameWon, timer, flagsUsed, revealCell, toggleFlag, resetGame } = game;
  </script>
  
  <header class="text-center">
	<h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Minesweeper</h1>
	<div class="flex gap-4 justify-center mt-2">
	  <span class="text-lg text-gray-800 dark:text-gray-200">⏳ Time: {$timer}s</span>
	  <span class="text-lg text-gray-800 dark:text-gray-200">🚩 Flags: {$flagsUsed}</span>
	</div>
  </header>
  
  <div class="text-center mt-4">
	<button on:click={resetGame} class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition dark:bg-blue-800 dark:hover:bg-blue-700">
	  Restart
	</button>
  </div>
  
  {#if $gameOver}
	<div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-10">
	  <div class="text-center text-2xl font-bold text-red-500 dark:text-red-300">Game Over</div>
	  <button on:click={resetGame} class="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition dark:bg-blue-800 dark:hover:bg-blue-700">
		Restart
	  </button>
	</div>
  {/if}
  
  {#if $gameWon}
	<div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-10">
	  <div class="text-center text-2xl font-bold text-green-500 dark:text-green-300">You Win!</div>
	  <button on:click={resetGame} class="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition dark:bg-blue-800 dark:hover:bg-blue-700">
		Restart
	  </button>
	</div>
  {/if}
  
  <div class="grid grid-cols-10 gap-1 mx-auto my-4 max-w-[450px] w-full">
	{#each $grid as row, rowIndex}
	  {#each row as cell, colIndex}
		<button
		  class="cell w-10 h-10 border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 {cell.isRevealed ? 'bg-gray-300' : ''}"
		  on:click={() => revealCell(rowIndex, colIndex)}
		  on:contextmenu|preventDefault={() => toggleFlag(rowIndex, colIndex)}
		>
		  {#if cell.isRevealed}
			{#if cell.isMine}
			  <Bomb size={20} class="text-black dark:text-white" />
			{:else}
			  <span transition:fade>{ cell.adjacentMines || '' }</span>
			{/if}
		  {:else if cell.isFlagged}
			<div transition:fade>
			  <Flag size={20} class="text-red-500 dark:text-red-300" />
			</div>
		  {/if}
		</button>
	  {/each}
	{/each}
  </div>