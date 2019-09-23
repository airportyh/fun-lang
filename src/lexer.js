const moo = require("moo");

const lexer = moo.compile({
    ws: /[ \t]+/,
    nl: { match: "\n", lineBreaks: true },
    fun: "fun",
    proc: "proc",
    while: "while",
    for: "for",
    else: "else",
    in: "in",
    if: "if",
    lte: "<=",
    lt: "<",
    gte: ">=",
    gt: ">",
    lparan: "(",
    rparan: ")",
    comma: ",",
    lbracket: "[",
    rbracket: "]",
    lbrace: "{",
    rbrace: "}",
    assignment: "=",
    return: "return",
    plus: "+",
    minus: "-",
    multiply: "*",
    divide: "*",
    colon: ":",
    comment: {
        match: /#[^\n]*/,
        value: s => s.substring(1)
    },
    string_literal: {
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
        value: s => JSON.parse(s)
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => Number(s)
    },
    identifier: /[a-z_][a-z_0-9]*/
});

module.exports = lexer;