const { run, test } = require("./support");
const stringMatching = expect.stringMatching;
const arrayContaining = expect.arrayContaining;

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

test("fun parameters (more than 1)", async () => {
const program = `
fun add(a, b) [
    return a + b
]

proc main() [
    print(add(1, 2))
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("3\n");
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
    expect(result.generate.js)
        .toEqual(
            stringMatching(/\/\/ I am a comment/)
        );
});

test("fun index assignment (disallowed)", async () => {
const program = `
fun hello(input) [
    input[0] = 1
]

proc main() [
    print(hello([1, 2, 3]))
]
`;
    const result = await run(program);
    expect(result.check)
        .toEqual(
            arrayContaining(
                [stringMatching(/Indexed assignment found\./)]
            )
        );

});

test("fun while loop (disallowed)", async () => {
const program = `
fun hello() [
    while true [
        print("Hello")
    ]
]

proc main() [
    hello()
]
`;
    const result = await run(program);
    expect(result.check)
        .toEqual(
            arrayContaining(
                [stringMatching(/While loop used in a fun\./)]
            )
        );
});

test("fun if statement (standalone, no else)", async () => {
const program = `
fun door(age) [
    if age >= 21 [
        return "You may come in."
    ]
]

proc main() [
    print(door(22))
    print(door(10))
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("You may come in.\nundefined\n");
});

test("fun if statement (with else)", async () => {
const program = `
fun door(age) [
    if age >= 21 [
        return "You may come in."
    ] else [
        return "Stay out."
    ]
]
proc main() [
    print(door(22))
    print(door(10))
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("You may come in.\nStay out.\n");
});

test("fun if statement (with else if)", async () => {
const program = `
fun door(age) [
    if age >= 21 [
        return "You may come in."
    ] else if age >= 18 [
        return "Wait a couple years."
    ] else [
        return "Stay out."
    ]
]
proc main() [
    print(door(22))
    print(door(19))
    print(door(10))
]
`;
    const result = await run(program);
    expect(result.exec.stdout)
        .toEqual("You may come in.\nWait a couple years.\nStay out.\n");
});

test("checker works for nested statements within if statement", async () => {
// we are not going to exhaustive checks here so as to not
// repeat ourselves, but only checking for the re-assignment of
// variables in this case
const program = `
fun door(age) [
    message = ""
    if age >= 21 [
        # Do nothing
        message = "You may come in."
    ] else if age >= 18 [
        message = "Wait a couple years."
    ] else [
        message = "Stay out."
    ]
    return message
]
proc main() [
    print(door(22))
    print(door(19))
    print(door(10))
]
`;
    const result = await run(program);
    expect(result.check.length).toEqual(3);
});

test("fun for loops", async () => {
const program = `
fun multiply(numbers) [
    doubled = []
    for num in numbers [
        push(doubled, num * 2)
    ]
    return doubled
]

proc main() [
    print(multiple([1, 2, 3]))
]
`;
    const result = await run(program);
    expect(result.check)
        .toEqual(
            arrayContaining(
                [stringMatching(/For loop used in a fun\./)]
            )
        );
});
