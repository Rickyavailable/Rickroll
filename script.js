const socket = io('https://your-server-url.com'); // Replace with your actual server URL

const board = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let mySymbol = null;
let gameActive = true;

// When connected, ask for a symbol
socket.on('assignSymbol', (symbol) => {
    mySymbol = symbol;
    statusText.textContent = mySymbol === 'X' ? "Your turn" : "Opponent's turn";
});

// When a move is received from the server
socket.on('move', ({ index, player }) => {
    board[index].textContent = player;
    board[index].classList.add('taken');
    gameActive = !checkWin();

    if (!gameActive) {
        statusText.textContent = `Player ${player} Wins!`;
    } else {
        currentPlayer = player === 'X' ? 'O' : 'X';
        statusText.textContent = mySymbol === currentPlayer ? "Your turn" : "Opponent's turn";
    }
});

// Handle cell click
board.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!gameActive || cell.textContent !== '' || mySymbol !== currentPlayer) return;

        const index = cell.getAttribute('data-index');
        socket.emit('move', { index, player: mySymbol });
    });
});

// Check win function
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => board[index].textContent === currentPlayer);
    });
}

// Reset game
resetButton.addEventListener('click', () => {
    socket.emit('reset');
});

socket.on('reset', () => {
    board.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = mySymbol === 'X' ? "Your turn" : "Opponent's turn";
});
