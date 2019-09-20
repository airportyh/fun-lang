const { exec } = require("mz/child_process");
const path = require("path");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a file name.");
        return;
    }
    const fileBaseName = path.basename(filename, ".fun");
    await exec(`node ${__dirname}/parse.js ${filename}`);
    try {
        await exec(`node ${__dirname}/check.js ${fileBaseName}.ast`);
        await exec(`node ${__dirname}/generate.js ${fileBaseName}.ast`);
        const [stdout, stderr] = await exec(`node ${fileBaseName}.js`);
        process.stdout.write(stdout.toString());
        if (stderr.toString()) {
            process.stdout.write(stderr.toString());
        }
    } catch (e) {
        console.log(e);
    }
}

main().catch(err => console.log(err.stack));