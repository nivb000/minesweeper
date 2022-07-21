'use strict'


const MINE = `<img src="img/mine.png">`
const FLAG = `<img src="img/flag.png">`

var gLevel = {
    SIZE: 4,
    MINES: 2,
    FLAGS: 2
}
var gGame
var gBoard
var gClickedCounter
var elSmile = document.querySelector(".smile")

function initGame() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: gLevel.SIZE / 2,
        safeClicks: 3
    }
    gClickedCounter = 0
    resetTimer()
    gBoard = buildBoard()
    renderBoard(gBoard)
    renderLives()
    renderSafeClicks()
    elSmile.innerHTML = '😀'
}



function buildBoard() {
    // Create the Matrix
    var board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // debugger
            var cell = {
                isShown: false,
                isMine: false,
                isMarked: false,
                minesAroundCount: 0
            }
            board[i][j] = cell;
        }
    }

    return board
}

function boardNeighbors(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)
        }

    }
}

function countNeighbors(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function clickedCell(i, j, elCell) {

    if (gGame.isOn === false) return

    elCell.classList.add("clickedCell")
    gClickedCounter++

    //Make sure First Click is not a mine
    if (gClickedCounter === 1) {
        for (let i = 0; i < gLevel.MINES; i++) {
            gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true
            boardNeighbors(gBoard)
        }
        startTimer()

    }

    var currCell = gBoard[i][j]

    if (currCell.isMine) {
        renderCell({ i, j }, MINE)
        gGame.lives--
        gLevel.FLAGS--
        renderLives()
        checkEndGame()
        return
    }

    currCell.isShown = true
    renderCell({ i, j }, currCell.minesAroundCount)
    gGame.shownCount++


    if (currCell.minesAroundCount === 0 && !currCell.isMine) {
        expendShown(gBoard, i, j)
        return
    }

    checkEndGame()

}

function toggleFlag(i, j, elCell) {

    var currCell = gBoard[i][j]
    currCell.isMarked = !currCell.isMarked


    if (!currCell.isMarked) {
        elCell.classList.remove("flagged")
        renderCell({ i, j }, "")
        gGame.markedCount--
        currCell.isMarked = false
        return
    }

    // must be before trying to add but after trying to remove
    if (gGame.markedCount === gLevel.FLAGS) {
        return
    }

    if (currCell.isMarked && !currCell.isShown || 
        currCell.isMarked && currCell.isShown) {
        elCell.classList.add("flagged")
        renderCell({ i, j }, FLAG)
        gGame.markedCount++
        currCell.isMarked = true
        checkEndGame()
        return
    }


}

function expendShown(board, cellI, cellJ) {

    var currCell
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            currCell = gBoard[i][j]
            if (!currCell.isShown) gGame.shownCount++
            currCell.isShown = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add("clickedCell")
            renderCell({ i, j }, currCell.minesAroundCount)
        }
    }

}

function checkEndGame() {

    if (gGame.lives === 0) {
        gGame.isOn = false
        elSmile.innerHTML = "😣"
        stopTimer()
        return
    }

    if (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES) &&
        gGame.markedCount === gLevel.FLAGS) {
        gGame.isOn = false
        stopTimer()
        elSmile.innerHTML = "😎"
    }
}

function levels(level, mines) {


    gLevel.SIZE = level
    gLevel.MINES = mines
    gLevel.FLAGS = gLevel.MINES
    initGame()

}

function renderLives() {

    var elLives = document.querySelector(".game-container .game-ui .lives")


    var strHTML = `<p class='lives'>`


    for (let i = 0; i < gGame.lives; i++) {

        strHTML += '💖'

    }

    strHTML += `</p>`

    elLives.innerHTML = strHTML
}

function safeClick() {

    if(gGame.safeClicks === 0) return

    gGame.safeClicks--


    var safeClicks = []

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown) {
                safeClicks.push({ i, j })
            }
        }
    }

    var randIdx = getRandomInt(0, safeClicks.length)
    var safeCell = safeClicks[randIdx]
    renderCell(safeCell, "💡")

    setTimeout(() => {

        renderCell(safeCell, gBoard[safeCell.i][safeCell.j].minesAroundCount)

    }, 3000);

    renderSafeClicks()


}
function renderSafeClicks() {

    var elHints = document.querySelector(".levels .safe-click")

    elHints.innerText = `Safe Click (${gGame.safeClicks})`

}