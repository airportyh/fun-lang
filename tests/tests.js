const { run } = require("../src/runner");
const stringMatching = expect.stringMatching;
const arrayContaining = expect.arrayContaining;

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

test("fun definitions", async () => {
const program = `
fun hello() [
  return "Hello, world!"
]
`;
    const result = await run(program);
    expect(result.generate.js)
        .toEqual(stringMatching(/function hello\(\)/));
});

test("proc definitions", async () => {
const program = `
proc a_proc() [
]
`;
    const result = await run(program);
    expect(result.generate.js)
        .toEqual(stringMatching(/async function a_proc\(\)/));
});

test("executes main; printing", async () => {
const program = `
proc main() [
  print("Hello")
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("Hello\n");
});

test("fun parameters", async () => {
const program = `
fun hello(subject) [
  return "Hello, " + subject + "!"
]

proc main() [
  print(hello("Ding"))
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("Hello, Ding!\n");
});

test("fun return statement", async () => {
const program = `
fun sum(x, y) [
    return x + y
]

proc main() [
    print(sum(2, 5))
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("7\n");
});

test("fun var assignment", async () => {
const program = `
fun difference(x, y) [
    diff = x - y
    return diff
]

proc main() [
    print(difference(5, 2))
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("3\n");
});

test("fun call statement (not allowed)", async () => {
const program = `
fun hello() [
    print("Hello")
]

proc main() [
    hello()
]
`;
    const result = await run(program);
    expect(result.check)
        .toEqual(
            arrayContaining([
                stringMatching(
                    /Call statement on it's own line found\./
                )
            ])
        );
});

test("fun line comment", async () => {
const program = `
fun hello() [
    # I am a comment
    return "Hello"
]

proc main() [
    print(hello())
]
`;
    const result = await run(program);
    console.log(result);
    expect(result.generate.js)
        .toEqual(
            stringMatching(/\/\/ I am a comment/)
        );
});

test("proc parameters", async () => {
const program = `
proc say_hello(subject) [
  print("Hello, " + subject + "!")
]

proc main() [
  say_hello("Maxim")
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("Hello, Maxim!\n");
});
