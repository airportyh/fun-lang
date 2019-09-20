//# this is a function definition

function hello() {
    var total = 0;
    var total = 1;
    //# this is a return statement
    return "Hello, world!";
}

function distance(x1, y1, x2, y2) {
    var delta_x = x1 - x2;
    var delta_y = y1 - y2;
    return sqrt(sqr(delta_x) + sqr(delta_y));
}

async function print_hello() {
    print(hello());
}

async function main(argv) {
    var d = distance(4, 9, 5, 12);
    print("The distance is", d);
}

main().catch(err => console.log(err.message));

// Built-in Functions:

function print(...args) {
    console.log(...args);
}

function map(fn, arr) {
    return arr.map(fn);
}

function filter(fn, arr) {
    return arr.filter(fn);
}

function reduce(fn, initValue, arr) {
    return arr.reduce(fn, initValue);
}

function sqrt(num) {
    return Math.sqrt(num);
}

function sqr(num) {
    return num * num;
}