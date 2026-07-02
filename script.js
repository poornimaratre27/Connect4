const rows = 6;
const cols = 7;

let board = [];
let currentPlayer = 1;
let gameOver = false;

let mode = "pvp";
let selectedMode = "pvp";

const boardDiv = document.getElementById("board");
const popup = document.getElementById("popup");

function createBoard() {
    board = [];
    boardDiv.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        board.push(Array(cols).fill(0));
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");

            cell.classList.add("cell");
            cell.onclick = () => playMove(c);

            boardDiv.appendChild(cell);
        }
    }
}

function playMove(col) {
    if (gameOver) return;

    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            board[r][col] = currentPlayer;

            updateBoard();

            if (checkWin(r, col)) {
                showWinner();
                return;
            }

            currentPlayer = currentPlayer === 1 ? 2 : 1;

            updateTurnText();

            if (
                mode === "ai" &&
                currentPlayer === 2
            ) {
                document.getElementById(
                    "statusText"
                ).innerText = "🤖 AI Thinking...";

                setTimeout(() => {
                    aiMove();
                }, 250);
            }

            return;
        }
    }
}

function aiMove() {
    let availableCols = [];

    for (let c = 0; c < cols; c++) {
        if (board[0][c] === 0) {
            availableCols.push(c);
        }
    }

    let col = availableCols[
        Math.floor(
            Math.random() *
            availableCols.length
        )
    ];

    playMove(col);
}

function updateBoard() {
    const cells =
        document.querySelectorAll(
            ".cell"
        );

    cells.forEach(
        (cell, index) => {

            let r = Math.floor(
                index / cols
            );

            let c = index % cols;

            cell.classList.remove(
                "blue",
                "yellow"
            );

            if (board[r][c] === 1) {
                cell.classList.add(
                    "blue"
                );
            }

            if (board[r][c] === 2) {
                cell.classList.add(
                    "yellow"
                );
            }
        }
    );
}

function checkWin(r, c) {
    return (
        count(r, c, 0, 1) +
        count(r, c, 0, -1) > 2 ||

        count(r, c, 1, 0) +
        count(r, c, -1, 0) > 2 ||

        count(r, c, 1, 1) +
        count(r, c, -1, -1) > 2 ||

        count(r, c, 1, -1) +
        count(r, c, -1, 1) > 2
    );
}

function count(r, c, dr, dc) {
    let player = board[r][c];
    let total = 0;

    r += dr;
    c += dc;

    while (
        r >= 0 &&
        r < rows &&
        c >= 0 &&
        c < cols &&
        board[r][c] === player
    ) {
        total++;

        r += dr;
        c += dc;
    }

    return total;
}

function updateTurnText() {
    const status =
        document.getElementById(
            "statusText"
        );

    status.innerText =
        currentPlayer === 1
        ? "🔵 Player 1 Turn"
        : mode === "ai"
        ? "🤖 AI Turn"
        : "🟡 Player 2 Turn";
}

function showWinner() {
    gameOver = true;

    popup.style.display = "flex";

    document.querySelector(
        ".popupBox h2"
    ).innerText =
        currentPlayer === 1
        ? "🔵 Player 1 Wins!"
        : mode === "ai"
        ? "🤖 AI Wins!"
        : "🟡 Player 2 Wins!";

    document.querySelector(
        ".modeButtons"
    ).style.display = "none";

    document.getElementById(
        "startBtn"
    ).innerText = "Restart";
}

function restartGame() {
    gameOver = false;

    currentPlayer = 1;

    popup.style.display = "none";

    createBoard();
    updateTurnText();

    document.querySelector(
        ".popupBox h2"
    ).innerText =
        "Select Game Mode";

    document.querySelector(
        ".modeButtons"
    ).style.display = "flex";

    document.getElementById(
        "startBtn"
    ).innerText = "Start Game";
}

document.getElementById(
    "openModePopup"
).onclick = () => {
    popup.style.display = "flex";
};

document.querySelectorAll(
    ".modeBtn"
).forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll(
                ".modeBtn"
            )
            .forEach(b => {
                b.classList.remove(
                    "active"
                );
            });

        btn.classList.add(
            "active"
        );

        selectedMode =
            btn.dataset.mode;
    };
});

document.getElementById(
    "startBtn"
).onclick = () => {

    if (gameOver) {
        restartGame();
        return;
    }

    mode = selectedMode;

    document.getElementById(
        "selectedMode"
    ).innerText =
        mode === "ai"
        ? "Player vs AI"
        : "Player vs Player";

    document.getElementById(
        "rightPlayer"
    ).innerText =
        mode === "ai"
        ? "🤖 AI"
        : "🟡 Player 2";

    restartGame();
};

createBoard();
updateTurnText();