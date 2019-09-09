const { parse } = require("../src/parser");
const { check } = require("../src/checker");
const { generateCode } = require("../src/generator");
const fs = require("mz/fs");
const path = require("path");
const yaml = require("js-yaml");

async function main() {
    const files = await fs.readdir(path.join(__dirname, "..", "examples"));
    for (let file of files) {
        if (file.endsWith(".fun")) {
            const filepath = path.join(__dirname, "..", "examples", file);
            const code = (await fs.readFile(filepath)).toString();
            const result = {
                parse: {},
                check: null,
                generate: {}
            };
            try {
                result.parse.ast = parse(code);
                result.check = check(result.parse.ast);
                if (result.check.length === 0) {
                    try {
                        result.generate.js = generateCode(result.parse.ast)
                    } catch (e) {
                        result.generate.error = e.stack;
                    }
                }
            } catch (e) {
                result.parse.error = e.stack;
            }

            const baseFileName = path.basename(file, ".fun");
            const outputFileName = path.join(__dirname, "..", "examples", baseFileName + ".result");
            await fs.writeFile(outputFileName, yaml.safeDump(result));
            console.log(`Wrote ${outputFileName}.`);
        }
    }
}

main().catch(err => console.log(err.message));