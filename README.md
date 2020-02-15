# The Fun Programming Language

Fun is programming language that supports both the functional and the
imperative styles of programming. It distinguishes these two styles
by allowing the programmer to choose between them explicitly: you can
either write *funs* - which are [pure](https://en.wikipedia.org/wiki/Pure_function),
or *procs* - which are impure. You may also combine
funs and procs as you see fit.

A fun looks like this:

```
fun distance(x, y) [
    return abs(x - y)
]
```

A proc looks like this:

```
proc say_hello(subject) [
    print("Hello, " + subject + "!")
]
```

The difference between them are:

1. the keyword `fun` vs `proc`
2. funs may only contain pure code, while procs may contain
a combination of pure and impure code

## Pure Code

What is pure code? In order for code to be pure, it must
satisfy the following:

1. It must not have side-effects, which includes:
    * I/O (Input/Output) - i.e. printing to the terminal, making network requests, accessing the filesystem
    * mutating (fancy word for: changing) existing data structures
2. It must evaluate to the same result every time given the same input values. i.e. random and current date/time functions are not allowed

## Purpose

The purpose of this project is two fold:

1. To provide a tool for developers to *learn or teach functional programming* - while Fun is not meant to be a production-ready programming language, you may use it
to solve code challenges on sites like Codewars or HackerRank to sharpen your understanding of functional programming.
2. To provide an programming language project for developers to *learn or teach programming language implementation* - if you are interested in learning how
to build a programming language, you may learn by digging
into the source code of Fun. It is designed to be self-documenting and hackable from the ground up. There
is also a supplementing video series covering the basics.

## Dig Deeper

To learn more, read:

* [The Fun User Manual](USER_MANUAL.md)
* [The Fun Developer Manual](CONTRIBUTING.md)
* Watch this [video series](https://www.youtube.com/playlist?list=PLSq9OFrD2Q3DasoOa54Vm9Mr8CATyTbLF) where I teach how to build a programming language.

## Todos

* if statement should evaluate to a value
* in pure mode, an if statement should have extra restrictions
    * there should be only one expression within each clause, maybe with the exception of preceding var assignments
    * else statement is required
* variable scoping with any code block
* enforce horizontal layout so that each panel has enough space
* clean up checker error messages so that color formatting codes are inserted at display time,
and doesn't have to interfere with the tests
* allow jumping to a particular line (ala breakpoints)
* make more test programs to test how well debugger works
* optimize initial load time expression-matters.fun
* allow jumping to the end of the program
* add immutable update function or syntax for updating dictionaries
* answering questions such as:
   * what statement last modified this value?
   * what values did this variable take on?
   * did this condition ever occur?
   * did this function ever get called?
   * how many times did this function get called?
   * how many times did this function get called with this parameter (or these parameters)?
* add break statement syntax
* use Map to back dictionaries?
* optimize code display (don't have to redraw every frame)
* have run.js also generate the intermediate files for ease of debugging
* real IO (DOM, fs, network, etc)
* clean up heap variables that were allocated local to a function call (do we need GC??)
* add assertions
* thing about immutable data in the language
* maybe table display for the stack frame too
* highlight the current line
* flow layout for the heap to pack more stuff in
* debugger rendering - consider building a more sophisticated layout framework to solve some space problems
* debugger rendering - consider building a UI framework to handle panels, scrolling, updating, erasing past content, overflows, etc
* optimize history file size by using more structure sharing or maybe compression mechanisms
* display content of the console
* put start and end info into sub-expressions too to allow highlighting sub-expressions that are
being evaluated
* colors!!
* stream to history file and forget history in memory to allow reclaiming of memory for app
* be able to switch generator between debug mode and normal mode, so that I can compare
performance with baseline
* check for purity in nested code blocks in general (if statements)
* mandatory return statements in funs?
* check that main proc exists
* generalize format of checker errors, and extract formating to outside of checker
* maybe have 2 pass traversal in checker to catalog the user defined callables first
* improve runtime errors
* write user manual
* documentation on the examples' test results format
* embed examples and docs in the grammar file?
* currying
* function composition
* function to get length of an array or dictionary
* allow for loop to loop through dictionary
* plus equals
* check for undefined and unused variables
* check for wrong number of arguments in function calls
* regex
* multi-line allowance
* runtime diagnostics
* IO
    * read_file
    * write_file
* type annotations and compile-time type checking
* source maps

### Done

* investigate why nearley freezes up on smiley.fun, also that case in jsonr (done)
* or, and operator (done)
* complete jest-based test suite and document it (done)
* back-in-time debugger (done)
* don't pause after calling a built-in function (done)
* parenthesis (done)
* syntax - allow multiple line list and dictionary literals (done)
* make checker support loops and if statements (done)
* fix Jest code coverage (done)
* check for purity in nested fun expressions (x)
* extract code_block into a grammar symbol (x)
* anonymous funs (x)
* reduce the size of token nodes in AST (x)
* ensure pure functions don't call non-pure ones (x)
* add code context display to checker errors and generator errors (x)
* add line number/range info in all nodes (x)
* add syntax checker for gen-parser (x)
* improve error message with run.js (x)
* unify test-example.js and run.js code (x)
* write comments and readmes (x)
* write some simple programs (x)
* string split (x)
* make run script (x)
* list - concat, pop (x)
* while loops (x)
* for loops for lists (x)
* if statements (x)
* print (x)
* have test runner execute the generated js (x)
* built-in functions and check for unknown functions (x)
* map/filter/reduce (x)
* more checks: can't do indexed assignment (x)
* add tokenizer and line info in checker and other diagnostics (x)
* test suite (x)
* index notation (x)
    * get
    * set
* type checking differentiating funs vs procs (x)
* funs (x)
* procs (x)
* numbers + simple arithmetic (x)
* strings + simple arithmetic (x)
* list (x)
* dictionaries (x)
* comments (x)
* allow source view to automatically scroll to the current line (done)
* fix fun expressions (done)
* fix array display for more then one length contents (done)
* for executable statements that are just a function call, don't pause again after the function evaluates(done)
* separate $recordLine from the state modification runtime functions? (done)
* heap rendering (done)
* support for list (done)
    * pop
    * map
    * filter
    * reduce
    * join
    * concat
    * split
    * range
* support for dictionary (done)
* use jsonr to persist history (done)
* write the debugger / adding tracking clauses for non-setting operations maybe (done)
* render visual for stack frame (done)
* step x of y display (done)
* add call parameters to stack frame (done)
* add retval display (done)
>>>>>>> time-travel-debugger
