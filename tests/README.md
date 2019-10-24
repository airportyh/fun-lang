# Tests

This folder contains test code and test support code for the Fun language.
The tests are written using the [Jest](https://jestjs.io/) test framework.
Care has been taken to write the tests in an self-documenting way and also
the test suite gives you good diagnostic information when there are failures.

To run the test suite, assuming you've done an `npm install` and `npm run gen-parser`
already:

```
npm test
```

or to invoke Jest directly: `jest` or `npx jest`.

## An Example Test Case

A file containing tests is a file in the `tests` folder that ends in `tests.js`.
Within such a file, a test case looks like this:

```js
test("top-level line comments", async () => {
const program = `
# I am a comment
proc main() [
]
`;
    const result = await run(program);
    expect(result.generate.js)
        .toEqual(stringMatching(/\/\/ I am a comment/));
});
```

We conventionally use the async/await syntax for a more succinct alternative
to writing a promise then-chain. Typically, a Fun program is written with a
multi-line string enclosed in back-ticks (\`). Then the program is run
by calling the `run` function, which is awaited, to yield the result, and
then the result of `run` is tested for satisfaction of a specific criteria
as required by the test case in question.

Note that both the `run` and `test` functions are to be imported from
the `support.js` file. As in:

```js
const { run, test } = require("./support");
```

The reason for this is explained in the next section.

## When a Test Case Fails

When a test case fails, the `result` object returned by the `run` function
will be saved to a file under the `tests` folder with the naming scheme:
the name of the test followed by `.result`. For example, the resulting
output file for the test `"top-level line comments"` will be
`tests/top-level line comments.result`.

The result file is in a human readable format called YAML. The developer
can then inspect the result file to see what happen without having to
do quite so much `console.log` debugging.

If the test case subsequently passes, the result file will then be removed.
The code that supports the creation and deletion of the result files can
be found in `support.js`. In order to take advantage of this diagnostics
feature, you need to import the `run` and `test` functions from `support.js`
at the top of each of the test files.
