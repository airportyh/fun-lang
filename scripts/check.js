const fs = require("mz/fs");
const { check } = require("../src/checker");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a file name.");
        return;
    }
    const ast = JSON.parse((await fs.readFile(filename)).toString());
    const result = check(ast);
    if (result.length === 0) {
        console.log("Ok");
        process.exit(0);
    } else {
        console.log(result.join("\n"));
        process.exit(1);
    }
}

main().catch(err => console.log(err.message));
