const fs = require("mz/fs");
const path = require("path");
const { parse } = require("../src/parser");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.warn("Please provide a file name.");
        return;
    }
    const outputFilename = path.basename(filename, ".fun") + ".ast";
    const code = (await fs.readFile(filename)).toString();
    
    try {
        const ast = parse(code);
        await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
        console.log(`Wrote ${outputFilename}.`);
    } catch (e) {
        console.log(e.message);
    }
}

main().catch(err => console.log(err.message));