const fs = require("mz/fs");
const path = require("path");
const { generateCode } = require("../src/generator");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a file name.");
        return;
    }
    const ast = JSON.parse((await fs.readFile(filename)).toString());
    const outputFilename = path.basename(filename, ".ast") + ".js";
    const jsCode = generateCode(ast);
    await fs.writeFile(outputFilename, jsCode);
    console.log(`Wrote ${outputFilename}.`);
}

main().catch(err => console.log(err.message));
