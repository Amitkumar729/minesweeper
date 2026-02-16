# NEON_SWEEPER // TERMINAL_V1

A neon-styled Minesweeper game built with **React** (Vite).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Build for production

```bash
npm run build
```

Output is in `dist/`. Serve with any static host or `npm run preview` to test.

## Project structure

- `src/App.jsx` – Main app and layout
- `src/hooks/useMinesweeper.js` – Game state and logic (grid, mines, reveal, flags, timer, win/lose)
- `src/components/` – Header, Controls, StatsBar, Grid, Cell, TerminalFooter, Modal
- `src/config.js` – Difficulty config (easy / medium / hard)
- `src/index.css` – Global styles, CRT/scanline effects, glitch title

## Gameplay

- **Left-click** – Reveal cell (starts timer on first click)
- **Right-click** – Toggle flag
- **LEVEL_01 / 02 / 03** – Change difficulty (restarts game)
- **INITIALIZE_SWEEP** – New game (same difficulty)
