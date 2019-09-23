const fs = require("mz/fs");
const { check } = require("../src/checker");
const path = require("path");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a file name.");
        return;
    }
    const codeFilename = path.join(
        path.dirname(filename), 
        path.basename(filename, ".ast") + ".fun");
    const code = (await fs.readFile(codeFilename)).toString();
    const ast = JSON.parse((await fs.readFile(filename)).toString());
    const result = check(ast, code);
    if (result.length === 0) {
        console.log("Ok");
        process.exit(0);
    } else {
        console.log(result.join("\n"));
        process.exit(1);
    }
}

main().catch(err => console.log(err.stack));
