const moo = require("moo");

const lexer = moo.compile({
    ws: /[ \t]+/,
    nl: { match: "\n", lineBreaks: true },
    fun: "fun",
    proc: "proc",
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
    comment: /#[^\n]*/,
    string_literal: {
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
        value: s => s.slice(1, -1)
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => Number(s)
    },
    identifier: /[a-z_][a-z_0-9]*/
});

module.exports = lexer;