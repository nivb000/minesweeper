
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {

            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            strHTML += `\t<td class="cell ${cellClass}"  onclick="clickedCell(${i}, ${j}, this)" oncontextmenu="toggleFlag(${i}, ${j}, this)">\n`;

            strHTML += '\t</td>\n';
        }

        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}



//**********STOPWATCH

var gMin = 0
var gSec = 0
var gStoptime = true

var elTimer = document.querySelector(".timer")

function startTimer() {
    if (gStoptime == true) {
        gStoptime = false;
        timerCycle();
    }
}
function stopTimer() {
    if (gStoptime == false) {
        gStoptime = true;
    }
}
function resetTimer() {

    elTimer.innerHTML = "00:00";
    gStoptime = true;
    gSec = 0;
    gMin = 0;
}

function timerCycle() {


    if (gStoptime == false) {
        gSec = parseInt(gSec);
        gMin = parseInt(gMin);

        gSec = gSec + 1;

        if (gSec == 60) {
            gMin = gMin + 1;
            gSec = 0;
        }
        if (gMin == 60) {
            gMin = 0;
            gSec = 0;
        }

        if (gSec < 10 || gSec == 0) {
            gSec = '0' + gSec;
        }
        if (gMin < 10 || gMin == 0) {
            gMin = '0' + gMin;
        }

        elTimer.innerHTML = gMin + ':' + gSec;

        setTimeout("timerCycle()", 1000);
    }
}