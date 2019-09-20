const builtInFunctions = require("./built-in-functions");

exports.check = function check(ast) {
    const userFunctions = [];
    const result = [];
    for (let node of ast) {
        result.push(...checkTopLevelStatement(node, userFunctions));
    }
    return result;
}

function checkTopLevelStatement(statement, userFunctions) {
    if (statement.type === "fun_definition") {
        userFunctions.push(statement.name.text);
        return checkFun(statement, userFunctions);
    } else if (statement.type === "proc_definition") {
        return checkProc(statement, userFunctions);
    } else {
        return [];
    }
}

function checkFun(fun, userFunctions) {
    const results = [];
    const vars = {};
    for (let statement of fun.body) {
        if (statement.type === "var_assignment") {
            if (statement.var_name in vars) {
                const first = vars[statement.var_name];
                results.push(
                    "Re-assignment of variable " + 
                    '"' + statement.var_name.text + '"' +
                    " on line " + statement.var_name.line + 
                    " column " + statement.var_name.col +
                    ". This is disallowed in funs. " +
                    "First assignment of " +
                    '"' + statement.var_name.text + '"' +
                    " found on line " + first.line + 
                    " column " + first.col + ".");
            } else {
                vars[statement.var_name] = statement.var_name;
            }
            results.push(...checkExpression(statement.value, userFunctions));
        } else if (statement.type === "indexed_assignment") {
            results.push(
                "Indexed assignment on line " +
                statement.subject.var_name.line + 
                " column " + statement.subject.var_name.col + ". " +
                "This is disallowed in funs."
            );
        } else if (statement.type === "call_expression") {
            results.push(
                "Call statement on it's own on line " +
                statement.fun_name.line +
                " column " + statement.fun_name.col + ". " +
                "This is disallowed in funs."
            );
        } else if (statement.type === "return_statement") {
            results.push(...checkExpression(statement.value, userFunctions));
        }
    }
    return results;
}

function checkExpression(expression, userFunctions) {
    const results = [];
    if (expression.type === "call_expression") {
        const fun_name = expression.fun_name.text;
        if (!(fun_name in builtInFunctions) &&
            userFunctions.indexOf(fun_name) === -1) {
            results.push(
                "Call to unknown function " +
                '"' + fun_name + '"' +
                " on line " + expression.fun_name.line + 
                " column " + expression.fun_name.col
            );
        }
    } else if (expression.type === "binary_expression") {
        results.push(...checkExpression(expression.left, userFunctions));
        results.push(...checkExpression(expression.right, userFunctions));
    } else if (expression.type === "list_literal") {
        for (let item of expression.items) {
            results.push(...checkExpression(item, userFunctions));
        }
    } else if (expression.type === "dictionary_literal") {
        for (let entry of expression.entries) {
            results.push(...checkExpression(entry[1], userFunctions));
        }
    } else if (expression.type === "indexed_access") {
        results.push(...checkExpression(expression.subject, userFunctions));
        results.push(...checkExpression(expression.index, userFunctions));
    }
    return results;
}

function checkProc(prop) {
    return [];
}