const board = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle cell click
board.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');

        if (gameBoard[index] || !gameActive) return;

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('taken');

        if (checkWin()) {
            statusText.textContent = `Player ${currentPlayer} Wins!`;
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== "")) {
            statusText.textContent = "It's a Draw!";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusText.textContent = `Player ${currentPlayer}'s turn`;
        }
    });
});

// Check win function
function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => gameBoard[index] === currentPlayer);
    });
}

// Reset game
resetButton.addEventListener('click', () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player X's turn`;
    board.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('taken');
    });
});
