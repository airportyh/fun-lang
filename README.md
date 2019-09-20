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