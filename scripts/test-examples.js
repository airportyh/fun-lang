const { parse } = require("../src/parser");
const { check } = require("../src/checker");
const { generateCode } = require("../src/generator");
const util = require("util");
const fs = require("mz/fs");
const child_process = require("mz/child_process");
const path = require("path");
const yaml = require("js-yaml");

async function main() {
    const files = await fs.readdir(path.join(__dirname, "..", "examples"));
    for (let file of files) {
        if (file.endsWith(".fun")) {
            const filepath = path.join(__dirname, "..", "examples", file);
            const code = (await fs.readFile(filepath)).toString();
            const result = {
                parse: null,
                check: null,
                generate: null
            };
            try {
                result.parse = { ast: parse(code) };
                result.check = check(result.parse.ast);
                if (result.check.length === 0) {
                    try {
                        const js = generateCode(result.parse.ast);
                        result.generate = { js: js };
                        const escapedCode = js.split("\n").join("\\\n");
                        try {
                            const [stdout, stderr] = await child_process.exec(`node -e '${js}'`);
                            result.exec = {
                                stdout: stdout.toString(),
                                stderr: stderr.toString()
                            };
                        } catch (e) {
                            result.exec = { error: e.stack };
                        }
                    } catch (e) {
                        result.generate = { error: e.stack };
                    }
                }
            } catch (e) {
                result.parse = { error: e.stack };
            }

            const baseFileName = path.basename(file, ".fun");
            const outputFileName = path.join(__dirname, "..", "examples", baseFileName + ".result");
            
            await fs.writeFile(outputFileName, 
                yaml.safeDump(JSON.parse(JSON.stringify(result))));
            console.log(`Wrote ${outputFileName}.`);
        }
    }
}

main().catch(err => console.log(err.message));