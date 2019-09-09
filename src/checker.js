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
                const first = vars[statement.var_name];
                result.push(
                    "Re-assignment of variable " + 
                    '"' + statement.var_name + '"' +
                    " on line " + statement.var_name.line + 
                    " column " + statement.var_name.col +
                    ". This is disallowed in funs. " +
                    "First assignment of " +
                    '"' + statement.var_name + '"' +
                    " found on line " + first.line + 
                    " column " + first.col + ".");
            } else {
                vars[statement.var_name] = statement.var_name;
            }
        }
    }
    return result;
}

function checkProc(prop) {
    return [];
}