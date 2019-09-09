const fs = require("mz/fs");

exports.check = function check(ast) {
    const result = [];
    for (let node of ast) {
        result.push(...checkTopLevelStatement(node));
    }
    return result;
}

function checkTopLevelStatement(statement) {
    if (statement.type === "fun_definition") {
        return checkFun(statement);
    } else if (statement.type === "proc_definition") {
        return checkProc(statement);
    } else {
        return [];
    }
}

function checkFun(fun) {
    const result = [];
    const vars = {};
    for (let statement of fun.body) {
        if (statement.type === "var_assignment") {
            if (statement.var_name in vars) {
                result.push("Reassignment of variable: " + statement.var_name + ", this is disallowed in funs.");
            }
            vars[statement.var_name] = true;
        }
    }
    return result;
}

function checkProc(prop) {
    return [];
}