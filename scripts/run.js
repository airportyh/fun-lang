const { run } = require("../src/runner");
const fs = require("mz/fs");
const indent = require("../src/indent");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a file name.");
        return;
    }
    const code = (await fs.readFile(filename)).toString();
    const result = await run(code);
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