const { run } = require("../src/runner");
const stringMatching = expect.stringMatching;

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

test("fun var assignment", async () => {
const program = `
fun distance(x1, y1, x2, y2) [
    delta1 = x1 - x2
    delta2 = y1 - y2
    return sqrt(sqr(delta1) + sqr(delta2))
]

proc main() [
    d = distance(0, 0, 3, 4)
    print("The distance is " + d)
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("The distance is 5\n");
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
