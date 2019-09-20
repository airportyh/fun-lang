# Fun Scripts

The scripts in this directory are for both the users and developers of the Fun language.

* parse.js - parses a Fun program given a `.fun` file. It creates a `.ast` file. The contents of the `.ast` is in
JSON format.
* check.js - checks a Fun program for mistakes given the `.ast` file generated from the parse step. Outputs "Ok" or a
number of error messages.
* generate.js - generates a JavaScript program given the `.ast` file generated from the parse step. Outputs a `.js` file.
* run.js - executes a Fun program given a `.fun` file. Combines parse.js, check.js, generate.js and running the resulting JavaScript into one step.
* test-examples.js - tests each of the example programs under the `examples` directory. The test results are created and stored as `.result` files in the examples directory.

## parse.js

Assuming you have written a Fun program, say it is called `hello.fun` and looks like:

```
proc main() [
    print("Hello, world!")
]
```

To parse it, you do:

```
node scripts/parse.js hello.fun
```

If it succeeded, you should see a `hello.ast` that was created. This `.ast` is used by the checker
and the generator. You may open that file to see what the AST looks like if you'd like.

## check.js

Assuming you have a `.ast` file which was generated by the `parse.js` script, say it is called `hello.ast`.
To check the program for mistakes, you do:

```
node scripts/check.js hello.ast
```

If your program was free of mistakes, you should see "Ok". If your program had some mistakes, the checker will
show you what they are.

## generate.js

Assuming you have a `.ast` file which was generated by the `parse.js` script, let's say it is called `hello.ast`.

To generate a JavaScript program, you do:

```
node scripts/generate.js hello.ast
```

If it succeeded, you should see a `hello.js` file created. You can execute this program using Node.js;

```
node hello.js
```

## run.js

The run.js script combines all three steps: parse, check, generate into one for the convenience.

Assuming you have a Fun program, call it `hello.fun`, then you can simply do:

```
node scripts/run.js hello.fun
```

to execute it. Internally, it will call `parse.js`, `check.js`, `generate.js`, and then execute
the resulting JavaScript program using Node.js.

## test-examples.js

This script tests all example programs (`.fun` files) under the examples directory. For each
`.fun` file in there, it will parse, check, generate, and execute it, not using the scripts
in this directory but using the functions provided in `src` directly. The test results for
each program will be stored in a `.result` file with the corresponding
name as the program. To test the examples, do:

```
node scripts/test-examples.js
```