# Fun Compiler Implementation

This directory contains the source code of the Fun Compiler.
The compiler consists of the following modules:

* The parser
* The checker
* The generator
* The runner

More details about each is covered below.

## Parser

The Fun parser is implemented using the [Nearley parser generator](https://nearley.js.org/).
The grammar of the language is described in `fun-lang.ne` in the Nearley file format.
The parser also uses the [moo lexer generator](https://github.com/no-context/moo)
to tokenize the source code before consuming them. `lexer.js` specifies the
operation of the lexer.
The `nearleyc` tool is used to generate a parser in JavaScript (`fun-lang.js`) based on
the grammar file. To generate the parser, run `npm run gen-parser`.

To learn how to use Nearley, you can follow their [Getting Started Guide](https://nearley.js.org/docs/getting-started) or watch this [video series](https://www.youtube.com/playlist?list=PLSq9OFrD2Q3DasoOa54Vm9Mr8CATyTbLF).

To learn moo, take a look at [this article on using moo with Nearley](https://nearley.js.org/docs/tokenizers) 
as well as the [moo project page](https://github.com/no-context/moo).

## Checker

The Fun checker is implemented in `checker.js`. Its entry point is the exported
`check(ast)` function. It recursively iterates the AST
and checks for the following for a given program:

* both funs and procs:
    * correct number of call arguments to funs or procs
    * referenced variables are defined
    * show warnings for unused variables
* funs only:
    * no re-assignment of variables
    * no indexed assignments
    * no loops (while or for)
    * no calls to procs
    * one return statement in each possible branch
* loose funs - loose funs is a concept being considered, it allows for pure funs in a non-pure way:
    * can only mutate values that were initialized within the function
    * no calls to non-funs
* type checking - (planned some time in the future)

The result of the checker is returned as an array of strings - each string
being an error message. This is a work in progress.
Not all of these features have been implemented.

## Generator

The Fun code generator is implemented in `generator.js`. The entry point is the
exported `generateCode(ast)` function. The return value of the function is a
string containing JavaScript code. Similarly to the checker, it recursively
iterates the AST, but instead of checking for mistakes, it generates the
JavaScript representation of the code at each AST node, propagating the
results from the lower parts of the tree to the upper parts of the tree
in succession. The `built-in-functions.js` contains JavaScript functions
that are used by the generated JavaScript and are therefore
included with the generated JavaScript programs. The built-in functions
can be consider the *runtime* of the language.

## Runner

The Fun runner in implemented in `runner.js`. It combines the 
following 4 steps into 1:

1. Parse the program
2. Check the program
3. Generate the JavaScript code
4. Execute the JavaScript using Node.js

The entry point of the runner is the `run(code)` that is exported by
`runner.js`. It takes in Fun code as a string, and returns a
result object that contains the following:

* a `parse` property which contains an object within which
there is either an `error` property containing the error message - in
which case there was a parse error, or an `ast` property, in which case
there is the AST in JSON format.
* a `check` property which contains an array of errors. If the array
is empty that means there were no checker errors.
* a `generate` property hich contains an object within which
there is either an `error` property containing the error message -
in case of a generator error, or a `js` property containing the
generated JavaScript as a string.
* an `exec` property which contains an object within which there
is a `stdout` property containing the standard output content of
the resulting JavaScript as executed in Node.js, and a `stderr`
property containing that of the standard error output.