/**
 * NEON_SWEEPER // KROM_OS_v4.2
 * Core Game Logic
 */

const CONFIG = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
};

class NeonSweeper {
    constructor() {
        this.grid = [];
        this.rows = 0;
        this.cols = 0;
        this.mines = 0;
        this.flags = 0;
        this.cellsRevealed = 0;
        this.isGameOver = false;
        this.timer = 0;
        this.timerInterval = null;
        this.difficulty = 'easy';

        // DOM Elements
        this.gridElement = document.getElementById('game-grid');
        this.mineCountElement = document.getElementById('mine-count');
        this.flagCountElement = document.getElementById('flag-count');
        this.timerElement = document.getElementById('timer');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultyBtns = document.querySelectorAll('.btn-diff');
        this.modal = document.getElementById('modal-overlay');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalRestart = document.getElementById('modal-restart');
        this.terminalText = document.querySelector('.typing-text');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDifficulty('easy');
        this.startGame();
    }

    setupEventListeners() {
        this.resetBtn.addEventListener('click', () => this.startGame());
        this.modalRestart.addEventListener('click', () => {
            this.modal.classList.add('hidden');
            this.startGame();
        });

        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setDifficulty(btn.dataset.difficulty);
                this.startGame();
            });
        });

        // Prevent context menu on grid
        this.gridElement.addEventListener('contextmenu', e => e.preventDefault());
    }

    setDifficulty(level) {
        this.difficulty = level;
        const config = CONFIG[level];
        this.rows = config.rows;
        this.cols = config.cols;
        this.mines = config.mines;
        
        // Update grid layout
        this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
    }

    startGame() {
        this.isGameOver = false;
        this.flags = 0;
        this.cellsRevealed = 0;
        this.timer = 0;
        this.grid = [];
        this.updateStats();
        this.stopTimer();
        this.clearGrid();
        this.createGrid();
        this.placeMines();
        this.calculateNeighbors();
        this.logTerminal(`System initialized. Level: ${this.difficulty.toUpperCase()}. Ready for sweeping.`);
    }

    createGrid() {
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.row = r;
                cellElement.dataset.col = c;
                
                // Staggered reveal animation on start
                cellElement.style.animationDelay = `${(r * this.cols + c) * 0.005}s`;
                cellElement.classList.add('cell-animate');

                cellElement.addEventListener('click', () => this.handleCellClick(r, c));
                cellElement.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellRightClick(r, c);
                });

                this.gridElement.appendChild(cellElement);
                
                this.grid[r][c] = {
                    element: cellElement,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0
                };
            }
        }
    }

    clearGrid() {
        this.gridElement.innerHTML = '';
    }

    placeMines() {
        let placed = 0;
        while (placed < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (!this.grid[r][c].isMine) {
                this.grid[r][c].isMine = true;
                placed++;
            }
        }
    }

    calculateNeighbors() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isMine) continue;
                
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const rr = r + i;
                        const cc = c + j;
                        if (rr >= 0 && rr < this.rows && cc >= 0 && cc < this.cols) {
                            if (this.grid[rr][cc].isMine) count++;
                        }
                    }
                }
                this.grid[r][c].neighborMines = count;
            }
        }
    }

    handleCellClick(r, c) {
        if (this.isGameOver || this.grid[r][c].isRevealed || this.grid[r][c].isFlagged) return;

        if (this.timer === 0) this.startTimer();

        if (this.grid[r][c].isMine) {
            this.gameOver(false, r, c);
        } else {
            this.revealCell(r, c);
            this.checkWin();
        }
    }

    handleCellRightClick(r, c) {
        if (this.isGameOver || this.grid[r][c].isRevealed) return;

        const cell = this.grid[r][c];
        cell.isFlagged = !cell.isFlagged;
        
        if (cell.isFlagged) {
            cell.element.classList.add('flagged');
            this.flags++;
            this.logTerminal(`Flag deployed at [${r},${c}]. Sensors detecting anomalies.`);
        } else {
            cell.element.classList.remove('flagged');
            this.flags--;
            this.logTerminal(`Flag retracted from [${r},${c}].`);
        }
        this.updateStats();
    }

    revealCell(r, c) {
        const cell = this.grid[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        this.cellsRevealed++;
        cell.element.classList.add('revealed');

        if (cell.neighborMines > 0) {
            cell.element.textContent = cell.neighborMines;
            cell.element.classList.add(`n-${cell.neighborMines}`);
        } else {
            // Flood fill
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const rr = r + i;
                    const cc = c + j;
                    if (rr >= 0 && rr < this.rows && cc >= 0 && cc < this.cols) {
                        this.revealCell(rr, cc);
                    }
                }
            }
        }
    }

    checkWin() {
        const totalNonMines = (this.rows * this.cols) - this.mines;
        if (this.cellsRevealed === totalNonMines) {
            this.gameOver(true);
        }
    }

    gameOver(isWin, triggerR, triggerC) {
        this.isGameOver = true;
        this.stopTimer();

        if (isWin) {
            this.logTerminal("MISSION_SUCCESS: Sector cleared of all kinetic threats.");
            this.showModal("MISSION_COMPLETE", "All threats neutralized. Sector secure.");
        } else {
            this.logTerminal(`CRITICAL_ERROR: Kinetic mine detonated at [${triggerR},${triggerC}]. System compromised.`);
            // Reveal all mines
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.grid[r][c].isMine) {
                        this.grid[r][c].element.classList.add('mine');
                        if (r === triggerR && c === triggerC) {
                            this.grid[r][c].element.style.background = 'var(--neon-red)';
                            this.grid[r][c].element.style.boxShadow = '0 0 20px var(--neon-red)';
                        }
                    }
                }
            }
            this.showModal("MISSION_FAILED", "System breach detected. Kinetic mine detonated.");
        }
    }

    showModal(title, msg) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = msg;
        setTimeout(() => this.modal.classList.remove('hidden'), 500);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateStats();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateStats() {
        this.mineCountElement.textContent = String(this.mines).padStart(3, '0');
        this.timerElement.textContent = String(this.timer).padStart(3, '0');
        this.flagCountElement.textContent = String(this.flags).padStart(3, '0');
    }

    logTerminal(msg) {
        this.terminalText.textContent = msg;
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new NeonSweeper();
});
