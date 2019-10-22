exports.range = {
    code: `function range(...args) {
    let start, end;
    if (args.length === 1) {
        start = 0
        end = args[0];
    } else if (args.length === 2) {
        start = args[0];
        end = args[1];
    } else {
        throw new Error("Wrong number of arguments");
    }
    const ret = [];
    for (let i = start; i < end; i++) {
        ret.push(i);
    }
    return ret;
}`,
    pure: true
};

exports.split = {
    code: `function split(string, separator) {
    return string.split(separator)
}`,
    pure: true
};

exports.print = {
    code: `function print(...args) {
    console.log(...args);
}`,
    pure: false
};

exports.pop = {
    code: `function pop(array) {
    return array.pop();
}`,
    pure: true
};

exports.push = {
    code: `function push(array, item) {
    return array.push(item);
}`,
    pure: false
};

exports.concat = {
    code: `function concat(one, other) {
    return one.concat(other);
}`,
    pure: true
};

exports.map = {
    code: `function map(fn, arr) {
    return arr.map(fn);
}`,
    pure: true
};

exports.filter = {
    code: `function filter(fn, arr) {
    return arr.filter(fn);
}`,
    pure: true
};

exports.reduce = {
    code: `function reduce(fn, initValue, arr) {
    return arr.reduce(fn, initValue);
}`,
    pure: true
};

exports.sqrt = {
    code: `function sqrt(num) {
    return Math.sqrt(num);
}`,
    pure: true
};

exports.sqr = {
    code: `function sqr(num) {
    return num * num;
}`,
    pure: true
};

exports.join = {
    code: `function join(array, separator) {
    return array.join(separator);
}`,
    pure: true
};
