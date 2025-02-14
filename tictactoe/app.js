import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");

const gameID = "my-game"; // Unique game ID (for now, static)
let playerSymbol = "X"; // Default symbol

// Initialize the game
async function initGame() {
    const gameRef = doc(db, "games", gameID);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
        await setDoc(gameRef, {
            board: ["", "", "", "", "", "", "", "", ""],
            currentTurn: "X",
            winner: ""
        });
    }

    // Listen for real-time updates
    onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
            updateBoard(doc.data());
        }
    });
}

// Render the board
function updateBoard(gameData) {
    boardElement.innerHTML = "";
    gameData.board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.textContent = cell;
        cellElement.onclick = () => makeMove(index);
        boardElement.appendChild(cellElement);
    });

    statusElement.textContent = gameData.winner
        ? `Winner: ${gameData.winner}`
        : `Turn: ${gameData.currentTurn}`;
}

// Handle a move
async function makeMove(index) {
    const gameRef = doc(db, "games", gameID);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
        let gameData = gameSnap.data();
        
        if (!gameData.winner && gameData.board[index] === "" && gameData.currentTurn === playerSymbol) {
            gameData.board[index] = playerSymbol;
            gameData.currentTurn = playerSymbol === "X" ? "O" : "X";

            // Check for winner
            if (checkWinner(gameData.board)) {
                gameData.winner = playerSymbol;
            }

            await updateDoc(gameRef, gameData);
        }
    }
}

// Check for a winner
function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some(comb => 
        board[comb[0]] && board[comb[0]] === board[comb[1]] && board[comb[1]] === board[comb[2]]
    );
}

initGame();
