const { run } = require("../src/runner");
const fs = require("mz/fs");
const path = require("path");
const indent = require("../src/indent");

async function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.log("Please provide a file name.");
        return;
    }
    const historyFilePath = path.join(
        path.dirname(filePath),
        path.basename(filePath, ".fun") + ".history"
    );
    const code = (await fs.readFile(filePath)).toString();
    const result = await run(code, { historyFilePath: historyFilePath });
    if (result.parse.error) {
        console.error("Parser Error: " + result.parse.error);
    } else if (result.check.length > 0) {
        for (let error of result.check) {
            console.log("Checker Error:\n");
            console.log(indent(error));
        }
    } else if (result.generate.error) {
        console.log("Generator Error: " + result.generate.error);
    } else if (result.exec.error) {
        console.log("Runtime Error: " + result.exec.error);
    } else {
        process.stdout.write(result.exec.stdout);
        process.stderr.write(result.exec.stderr);
    }
}

main().catch(err => console.log(err.stack));
