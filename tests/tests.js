const { run, test } = require("./support");
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

test("proc parameters (more than 1)", async () => {
const program = `
proc say_result(a, b) [
    print(a + b)
]

proc main() [
    say_result(1, 2)
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("3\n");
});
