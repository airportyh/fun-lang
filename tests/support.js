/*
# Test Support

The magical scheme implemented here allows easier debugging of failing
tests by saving the result of executing a fun program when if fails a test.

Instead of using the normal global "test" function from Jest ("test" is equivalent to the
"it" function, although this repo has developed the convention of using "test"),
all of the usual tests are adviced to use the test function defined in this file,
as well as use the run function defined in this file to run their respective Fun programs.
In return for this, the developer will get a ".result" file showing the result of
each step (parse, check, generate, exec) of executing the program for each failing test.
".result" files are removed once their test passes.

*/

const path = require("path");
const { fs } = require("mz");
const yaml = require("js-yaml");

// We use "realRun" as an alias for our runner's run function.
const { run: realRun } = require("../src/runner");

// We use "jestTest" as an alise for the original "test" function from Jest,
// which is exposed to the global scope initially as set up by Jest.
const jestTest = global.test;

exports.test = function test(testName, testFunc) {
    /*
    What the below code does is essentially to turn this example test:

    ```js
    test("it should work", async () => {
        const program = `
        proc main() [
            print("Hello")
        ]
        `;
        const result = run(program);
        expect(result.exec.stdout).toEqual("Hello\n");
    });
    ```

    into:

    ```js
    test("it should work", async () => {
        try {
            const program = `
            proc main() [
                print("Hello")
            ]
            `;
            const result = run(program);
            expect(result.exec.stdout).toEqual("Hello\n");
            // Remove "tests/it should work.result" if it exists
        } catch (e) {
            // Save the result variable into the "tests/it should work.result" file
            throw e;
        }
    });
    ```

    */
    jestTest(testName, async () => {
        const resultFileName = path.join(__dirname, testName + ".result");
        try {
            await testFunc();
            if (await fs.exists(resultFileName)) {
                await fs.unlink(resultFileName);
            }
        } catch (e) {
            const result = {
                code: globalCode,
                ...globalResult,
                parse: JSON.stringify(globalResult.parse, null, "  ")
            };
            await fs.writeFile(resultFileName, yaml.safeDump(result));
            throw e;
        }
    });
};

// This global variable is used to secretly store the result of the last execution
// of the run function.
let globalResult;
let globalCode;

exports.run = async function run(code) {
    globalCode = code;
    globalResult = await realRun(code);
    return globalResult;
};
