const fs = require("mz/fs");
const path = require("path");
const yaml = require("js-yaml");
const { run: execute } = require("../src/runner");

async function main() {
    const files = await fs.readdir(path.join(__dirname, "..", "examples"));
    for (let file of files) {
        if (file.endsWith(".fun")) {
            const filepath = path.join(__dirname, "..", "examples", file);
            const code = (await fs.readFile(filepath)).toString();
            const result = await execute(code);
            const baseFileName = path.basename(filepath, ".fun");
            const outputFileName = path.join(__dirname, "..", "examples", baseFileName + ".result");
            
            await fs.writeFile(outputFileName, 
                yaml.safeDump(JSON.parse(JSON.stringify(result))));
            console.log(`Wrote ${outputFileName}.`);
        }
    }
}

main().catch(err => console.log(err.message));