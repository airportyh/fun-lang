# Fun Programming Language Developer Manual

This document gives an overview of the structure of the source code of
the implementation of the Fun programming language. Other than the
documentation files: `README.md`, `CONTRIBUTING.md` and `USER_MANUAL.md`
at the top level project directory, the following three directories are of
interest:

* [src](src) - contains the core source code of the Fun Programming Language
* [scripts](scripts) - contains command line utilities for running
and diagnosing Fun programs
* [examples](examples) - contains some code examples
* [tests](tests) - contains the test suite for the Fun Programming Language

## Architecture

The Fun compiler takes Fun code (extension `.fun`) and converts it into JavaScript code (extension `.js`). Its architecture is as follows:

```
                XXXXXXXXX
                XX       XXXXXX
                X   Fun Code  X
                XX         XXX
                  XXXXX+XXX
                    +
                    |
                    v
                +---+----+
                |        |
                | Parser |
                |        |
                +---+----+
                    |
                    v
                    XXXXXXX            +-----------+
                XXX        X            |          |
                X  AST      XX+-------->+ Checker  |
                XX         XX           |          |
                  XXXXXXXXXX            +----------+
                    +
                    |
                    v
                +----+------+
                |           |
                | Generator |
                |           |
                +----+------+
                    |
                    v
                    XXXXXX
                XXXX      XXXXXX
                XX  JavaScript  X
                XX             XX
                 XXXXXXXXXXXXXX
```

_Diagram created using http://asciiflow.com/._

As you can see, the parser takes Fun code and converts into an intermediate
representation called the AST, a.k.a the *abstract syntax tree* (more about this
later). Then, the checker takes the AST and checks for mistakes: in particular,
it checks for impure code within funs, which is disallowed by the language. The
checker also checks for common mistakes such as referencing non-existent variables
or functions or passing in a wrong number of arguments to a function. If the
checker passes, then the compiler moves on to the next step, the generator.
The generator takes the AST as input, and outputs JavaScript that can be executed
by [Node.js](https://nodejs.org).

## Abstract Syntax Trees (ASTs)

What is an AST? Let's see an example. The AST for the following
code:

```
answer = 6 * 7
```

looks like this:

```
                     +---+
            +--------+ = +---------
            |        +---+        |
            |                     |
            |                     v
        +----v---+               +-+-+
        | answer |           ----+ * +----
        +--------+          |    +---+   |
                            v            v
                            +-+-+        +-+-+
                            | 6 |        | 7 |
                            +---+        +---+
```

It is a tree structure that represents the the source code and
the intension of the author in an unambiguous way.
In JSON format, it is:

```
{
    "type": "var_assignment",
    "var_name": {
        "type": "identifier",
        "value": "answer"
    },
    "value": {
        "type": "binary_operation",
        "operator": {
            "type": "multiply",
            "value": "*"
        },
        "left": {
            "type": "number_literal",
            "value": 6
        },
        "right": {
            "type": "number_literal",
            "value": 7
        }
    }
}
```

As you can see, each node of the tree (AST node) is represented as a plain
object and contains a `type` property to allow a program to distinguish
it from other types of syntax construct. Each type of AST node
will also have additional properties that are specific to that type.
For example, a `var_assignment` has the properties:

* `var_name` - the name of the variable being assigned to
* `value` - the value that is being assigned to the variable

### Line Number Information

The JSON AST example above has been simplified to not include
file location information.
In reality, the Fun parser includes file location with every
AST node. So the AST for that example actually look like:

```
{
    "type": "var_assignment",
    "var_name": {
        "type": "identifier",
        "value": "answer",
        "start": {
            "line": 2,
            "col": 4
        },
        "end": {
            "line": 2,
            "col": 10
        }
    },
    "value": {
        "type": "binary_operation",
        "operator": {
            "type": "multiply",
            "value": "*",
            "start": {
                "line": 2,
                "col": 15
            },
            "end": {
                "line": 2,
                "col": 16
            }
        },
        "left": {
            "type": "number_literal",
            "value": 6,
            "start": {
                "line": 2,
                "col": 13
            },
            "end": {
                "line": 2,
                "col": 14
            }
        },
        "right": {
            "type": "number_literal",
            "value": 7,
            "start": {
                "line": 2,
                "col": 17
            },
            "end": {
                "line": 2,
                "col": 18
            }
        },
        "start": {
            "line": 2,
            "col": 13
        },
        "end": {
            "line": 2,
            "col": 18
        }
    },
    "start": {
        "line": 2,
        "col": 4
    },
    "end": {
        "line": 2,
        "col": 18
    }
}
```

As you can see, the node of the AST tree
contains additional line number information about where within the
source file the source code for the node came from.
This information allows the checker and the generator and potentially
other tools to output line number information with their error messages.

## Project Setup

You need to do the following before starting to make changes to the source code
and try them out:

* Install Node.js (https://nodejs.org)
* Change into the project directory
* Perform the command: `npm install`

## Dig Deeper

* [src directory](src)
* [scripts directory](scripts)
* [tests directory](tests)
* [examples directory](examples)
* This [video series](https://www.youtube.com/playlist?list=PLSq9OFrD2Q3DasoOa54Vm9Mr8CATyTbLF) covers how to create a programming language using JavaScript. Much of the tools and techniques used in those videos are used in this project.
