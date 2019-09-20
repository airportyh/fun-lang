exports.split = function split(string, separator) {
    return string.split(separator)
};

exports.print = function print(...args) {
    console.log(...args);
};

exports.pop = function pop(array) {
    return array.pop();
};

exports.push = function push(array, item) {
    return array.push(item);
};

exports.concat = function concat(one, other) {
    return one.concat(other);
};
exports.concat.pure = true;

exports.map = function map(fn, arr) {
    return arr.map(fn);
};
exports.map.pure = true;

exports.filter = function filter(fn, arr) {
    return arr.filter(fn);
};
exports.filter.pure = true;

exports.reduce = function reduce(fn, initValue, arr) {
    return arr.reduce(fn, initValue);
};
exports.reduce.pure = true;

exports.sqrt = function sqrt(num) {
    return Math.sqrt(num);
};
exports.sqrt.pure = true;

exports.sqr = function sqr(num) {
    return num * num;
};
exports.sqr.pure = true;

exports.join = function join(array, separator) {
    return array.join(separator);
}
exports.join.pure = true;