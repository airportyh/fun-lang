# Fun Scripts

The scripts in this directory are for both the users and developers of the
Fun language.

* run.js - executes a Fun program given a `.fun` file (combines parse.js, check.js, and generate.js into one step)
* parse.js - parses a Fun program given a `.fun` file. It creates a `.ast` file with the same base name as the input file
* check.js - checks a Fun program for mistakes given the `.ast` file generated from the parse step
* generate.js - generates a JavaScript file (`.js`) given the `.ast` file generated from the parse step
* test-examples.js - tests each of the example programs under the `examples` directory. The test results are created and stored as `.result` files