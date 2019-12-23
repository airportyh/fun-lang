const fs = require("mz/fs");
const path = require("path");
const jsonr = require("@airportyh/jsonr");

async function main() {
    const [windowWidth, windowHeight] = process.stdout.getWindowSize();
    const topOffset = 1;
    const stackFrameWidth = 40;
    clearScreen();
    process.stdin.setRawMode(true);
    process.stdin.on('data', (data) => {
        if (String(data) === 'q') {
            process.stdin.setRawMode(false);
            clearScreen();
            process.exit(0);
        }
        if (isUpArrow(data)) {
            stepBackward();
        } else if (isDownArrow(data)) {
            stepForward();
        }
    });
    const filePath = process.argv[2];
    if (!filePath) {
        console.log("Please provide a file name.");
        return;
    }

    const code = (await fs.readFile(filePath)).toString();

    const codeLines = code.split("\n");
    const maxLineNumberLength = String(codeLines.length).length;
    renderCodeLines(codeLines, maxLineNumberLength);

    const codeWidth = codeLines.reduce((longestWidth, line) =>
        line.length > longestWidth ? line.length : longestWidth, 0);

    const dividerColumn = codeWidth + maxLineNumberLength + 5;
    drawDivider(dividerColumn);
    drawDivider(dividerColumn + stackFrameWidth);

    const historyFilePath = path.join(
        path.dirname(filePath),
        path.basename(filePath, ".fun") + ".history"
    );

    const history = jsonr.parse((await fs.readFile(historyFilePath)).toString());
    let currentHistoryIdx = 0;

    renderProgramCounter();
    renderStackFrame(dividerColumn + 1);
    updateHistoryDisplay();

    // ========// UI/Stateful Helper functions ==============

    function updateHistoryDisplay() {
        const lastStepDisplay = `Step ${history.length} of ${history.length}`;
        const display = `Step ${currentHistoryIdx + 1} of ${history.length}`.padEnd(lastStepDisplay.length, ' ');
        printAt(1, windowHeight, display);
        park();
    }

    function displayValue(value) {
        if (typeof value === "string") {
            return quote(value);
        } else {
            return String(value);
        }
    }

    function quote(str) {
        return '"' + str.replace(/\"/g, '\\"') + '"';
    }

    function renderStackFrame() {
        const column = dividerColumn + 1;
        const histEntry = history[currentHistoryIdx];
        const stack = histEntry.stack;
        const lines = [];
        for (let i = stack.length - 1; i >= 0; i--) {
            renderFrame(stack[i], column, lines);
        }
        renderText(column, 1, stackFrameWidth - 1, windowHeight, lines);
    }

    function renderFrame(frame, column, lines) {
        const paramList = Object.keys(frame.parameters)
            .map(key => `${key}=${displayValue(frame.parameters[key])}`)
            .join(", ");
        const funDisplay = `${frame.funName}(${paramList})`.substring(0, stackFrameWidth - 1);
        lines.push(funDisplay);
        for (let varName in frame.variables) {
            lines.push(`  ${varName} = ${displayValue(frame.variables[varName])}`);
        }
    }

    function stepForward() {
        if (currentHistoryIdx + 1 >= history.length) {
            return;
        }

        eraseProgramCounter();
        currentHistoryIdx++;
        renderProgramCounter();
        renderStackFrame();
        updateHistoryDisplay();
        renderHeap();
    }

    function stepBackward() {
        if (currentHistoryIdx - 1 < 0) {
            return;
        }

        eraseProgramCounter();
        currentHistoryIdx--;
        renderProgramCounter();
        renderStackFrame();
        updateHistoryDisplay();
        renderHeap();
    }

    function eraseProgramCounter() {
        const histEntry = history[currentHistoryIdx];
        const line = histEntry.line;
        printAt(1, line + topOffset - 1, " ");
    }

    function renderProgramCounter() {
        const histEntry = history[currentHistoryIdx];
        const line = histEntry.line;
        printAt(1, line + topOffset - 1, "→");
        park();
    }

    function renderHeap() {
        const column = dividerColumn + stackFrameWidth + 1;
        const histEntry = history[currentHistoryIdx];
        const heap = histEntry.heap;
        let offsetTop = 1;
        let lines = [];
        for (let key in heap) {
            const object = heap[key];
            if (Array.isArray(object)) {
                const displayItems = object.map(displayValue);
                lines.push(
                    key + "┌" +
                    displayItems.map(item => "".padEnd(item.length, "─")).join("┬") +
                    "┐");
                if (displayItems.length > 0) {
                    lines.push(
                        "".padEnd(key.length, " ") +
                        "│" + displayItems.join("│") + "│");
                }
                lines.push(
                    "".padEnd(key.length, " ") +
                    "└" + displayItems.map(item => "".padEnd(item.length, "─")).join("┴") +
                     "┘");

            } else {
                // dictionary
                const entries = [];
                for (let key in object) {
                    entries.push([displayValue(key), displayValue(object[key])]);
                }
                const column1Width = entries.reduce((width, entry) =>
                    entry[0].length > width ? entry[0].length : width, 1);
                const column2Width = entries.reduce((width, entry) =>
                    entry[1].length > width ? entry[1].length : width, 1);
                const line1 = "&" + key + "┌" + Array(column1Width + 1).join("─") + "┬" + Array(column2Width).join("─") + "─┐";
                const lineLast = "  └" + Array(column1Width + 1).join("─") + "┴" + Array(column2Width).join("─") + "─┘";
                lines.push(line1);
                for (let i = 0; i < entries.length; i++) {
                    const entry = entries[i];
                    lines.push("  │" + entry[0].padEnd(column1Width, " ") + "│" + entry[1].padEnd(column2Width, " ") + "│");

                    if (i < entries.length - 1) {
                        lines.push("  ├" + "".padEnd(column1Width, "─") + "┼" + "".padEnd(column2Width, "─") + "┤");
                    } else {
                        lines.push(lineLast);
                    }
                }
                if (entries.length === 0) {
                    lines.push(lineLast);
                }
            }
        }
        renderText(column, 1, windowWidth - column + 1, windowHeight, lines);
    }

    function park() {
        printAt(1, windowHeight, "");
    }

    function drawDivider(leftOffset) {
        for (let i = 0; i < windowHeight; i++) {
            printAt(leftOffset, i + topOffset, "║");
        }
    }

    function renderCodeLines(codeLines, maxLineNumberLength) {
        clearScreen();
        for (let i = 0; i < codeLines.length; i++) {
            const line = String(i + 1)
                .padStart(maxLineNumberLength, " ")
                + " " + codeLines[i];
            printAt(3, i + topOffset, line);
        }
    }
}

main().catch((e) => console.log(e.stack));

// ============= Helper functions ================

function renderText(x, y, width, height, textLines) {
    for (let i = 0; i < height; i++) {
        const line = textLines[i] || "";
        printAt(x, y + i, line.substring(0, width).padEnd(width, " "));
    }
}

function clearScreen() {
    process.stdout.write(encode('[0m'));
    process.stdout.write(encode('[2J'));
    process.stdout.write(encode('c'));
}

function printAt(x, y, value) {
    process.stdout.write(encode(`[${y};${x}f`));
    process.stdout.write(value);
}

function isLeftArrow(data) {
    return data.length === 3 &&
        data[0] === 27 &&
        data[1] === 91 &&
        data[2] === 68;
}

function isRightArrow(data) {
    return data.length === 3 &&
        data[0] === 27 &&
        data[1] === 91 &&
        data[2] === 67;
}

function isUpArrow(data) {
    return data.length === 3 &&
        data[0] === 27 &&
        data[1] === 91 &&
        data[2] === 65;
}

function isDownArrow(data) {
    return data.length === 3 &&
        data[0] === 27 &&
        data[1] === 91 &&
        data[2] === 66;
}

// Stolen from charm
function encode (xs) {
    function bytes (s) {
        if (typeof s === 'string') {
            return s.split('').map(ord);
        }
        else if (Array.isArray(s)) {
            return s.reduce(function (acc, c) {
                return acc.concat(bytes(c));
            }, []);
        }
    }

    return Buffer.from([ 0x1b ].concat(bytes(xs)));
};

function ord (c) {
    return c.charCodeAt(0)
};
