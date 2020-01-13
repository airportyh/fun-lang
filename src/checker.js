const builtInFunctions = require("./built-in-functions");
const colors = require("colors/safe");
const indent = require("./indent");

exports.check = function check(ast, sourceCode) {
    const userCallables = {};
    const result = [];
    for (let node of ast) {
        result.push(...checkTopLevelStatement(node, userCallables, sourceCode, 0));
    }
    return result;
}

function checkTopLevelStatement(statement, userCallables, sourceCode, level) {
    if (statement.type === "fun_definition") {
        userCallables[statement.name.value] = statement;
        return checkFun(statement, userCallables, sourceCode, {}, level + 1);
    } else if (statement.type === "proc_definition") {
        userCallables[statement.name.value] = statement;
        return checkProc(statement, userCallables, sourceCode, {}, level + 1);
    } else {
        return [];
    }
}

function indentByLevel(level) {
    return Array(level + 1).join("  ");
}

function checkFun(fun, userCallables, sourceCode, vars, level) {
    const results = [];
    for (let statement of fun.body.statements) {
        results.push(...checkFunBodyStatement(
            statement, fun, userCallables, sourceCode, vars, level + 1))
    }
    return results;
}

function checkFunBodyStatement(statement, fun, userCallables, sourceCode, vars, level) {
    const results = [];
    if (statement.type === "var_assignment") {
        const var_name = statement.var_name.value;
        const line = statement.start.line;
        if (var_name in vars) {
            results.push(
                generateCodeContext(statement, sourceCode) + "\n" +
                "Re-assignment of variable " +
                '"' + var_name + '"' + ". This is disallowed in funs. \n" +
                "First assignment of " +
                '"' + var_name + '"' +
                " found here:\n\n" +
                generateCodeContext(vars[var_name], sourceCode)
            );
        } else {
            vars[var_name] = statement;
        }
        results.push(...checkExpression(
            statement.value, userCallables, sourceCode, vars, level + 1));
    } else if (statement.type === "indexed_assignment") {
        results.push(
            generateCodeContext(statement, sourceCode) +
            "\nIndexed assignment found. " +
            "This is disallowed in funs."
        );
    } else if (statement.type === "call_expression") {
        results.push(
            generateCodeContext(statement, sourceCode) + "\n" +
            "Call statement on it's own line found. \n" +
            "This is disallowed in funs because it implies what is called has a side-effect."
        );
    } else if (statement.type === "return_statement") {
        results.push(...checkExpression(
            statement.value, userCallables, sourceCode, vars, level + 1));
    } else if (statement.type === "while_loop") {
        results.push(
            generateCodeContext(statement, sourceCode) + "\n" +
            "While loop used in a fun. This is disallowed in funs."
        );
    } else if (statement.type === "comment") {
        // do nothing
    } else if (statement.type === "if_statement") {
        for (let childStatement of statement.consequent.statements) {
            results.push(
                ...checkExpression(
                    childStatement, userCallables, sourceCode, vars, level + 1)
            );
        }
        if (statement.alternate) {
            results.push(
                ...checkExpression(
                    statement.alternate, userCallables, sourceCode, vars, level + 1)
            );
        }
    } else if (statement.type === "for_loop") {
        results.push(
            generateCodeContext(statement, sourceCode) + "\n" +
            "For loop used in a fun. This is disallowed in funs."
        );
    } else {
        throw new Error("Unimplemented statement type: " + statement.type);
    }
    return results;
}

function checkExpression(expression, userCallables, sourceCode, vars, level) {
    const results = [];
    if (expression.type === "call_expression") {
        const callableName = expression.fun_name.value;
        if (callableName in builtInFunctions) {
            if (builtInFunctions[callableName].pure) {
                // okay
            } else {
                results.push(
                    generateCodeContext(expression, sourceCode) + "\n" +
                    "Call to a proc " + '"' + callableName + '"' +
                    " from a fun - this is disallowed."
                );
            }
        } else {
            if (userCallables[callableName]) {
                if (userCallables[callableName].type === "proc_definition") {
                    results.push(
                        generateCodeContext(expression, sourceCode) + "\n" +
                        "Call to a proc " + '"' + callableName + '"' +
                        " from a fun - this is disallowed."
                    );
                } else {
                    // okay
                }
            } else {
                results.push(
                    generateCodeContext(expression, sourceCode) + "\n" +
                    "Call to unknown function " +
                    '"' + callableName + '"' + " found."
                );
            }
        }
        for (let argument of expression.arguments) {
            results.push(...checkExpression(
                argument, userCallables, sourceCode, vars, level + 1));
        }
    } else if (expression.type === "binary_expression") {
        results.push(...checkExpression(
            expression.left, userCallables, sourceCode, vars, level + 1));
        results.push(...checkExpression(
            expression.right, userCallables, sourceCode, vars, level + 1));
    } else if (expression.type === "list_literal") {
        for (let item of expression.items) {
            results.push(...checkExpression(
                item, userCallables, sourceCode, vars, level + 1));
        }
    } else if (expression.type === "dictionary_literal") {
        for (let entry of expression.entries) {
            results.push(...checkExpression(
                entry[1], userCallables, sourceCode, vars, level + 1));
        }
    } else if (expression.type === "indexed_access") {
        results.push(...checkExpression(
            expression.subject, userCallables, sourceCode, vars, level + 1));
        results.push(...checkExpression(
            expression.index, userCallables, sourceCode, vars, level + 1));
    } else if (expression.type === "fun_expression") {
        results.push(...checkFun(
            expression, userCallables, sourceCode, vars, level + 1));
    } else if (expression.type === "var_assignment") {
        const var_name = expression.var_name.value;
        const line = expression.start.line;
        if (var_name in vars) {
            results.push(
                generateCodeContext(expression, sourceCode) + "\n" +
                "Re-assignment of variable " +
                '"' + var_name + '"' + ". This is disallowed in funs. \n" +
                "First assignment of " +
                '"' + var_name + '"' +
                " found here:\n\n" +
                generateCodeContext(vars[var_name], sourceCode)
            );
        } else {
            vars[var_name] = expression;
        }
        results.push(...checkExpression(
            expression.value, userCallables, sourceCode, vars, level + 1));
    } else if (expression.type === "if_statement") {
        for (let childStatement of expression.consequent.statements) {
            results.push(
                ...checkExpression(
                    childStatement, userCallables, sourceCode, vars, level + 1)
            );
        }
        if (expression.alternate) {
            results.push(
                ...checkExpression(
                    expression.alternate, userCallables, sourceCode, vars, level + 1)
            );
        }
    } else if (expression.type === "code_block") {
        for (let statement of expression.statements) {
            results.push(
                ...checkExpression(
                    statement,
                    userCallables,
                    sourceCode,
                    vars,
                    level + 1
                )
            );
        }
    }
    return results;
}

function checkProc(prop) {
    return [];
}

function generateCodeContext(statement, sourceCode) {
    const sourceLines = sourceCode.split("\n");
    const startLineIdx = Math.max(0, statement.start.line - 2 - 1);
    const endLineIdx = statement.end.line;
    const gutterWidth = String(endLineIdx + 1).length;

    const codeContext =
        sourceLines.slice(startLineIdx, endLineIdx)
        .map((line, idx) => {
            const lineNo = idx + startLineIdx + 1;
            if (lineNo === statement.start.line) {
                line = line.slice(0, statement.start.col) +
                    colors.black(colors.bgRed(line.slice(statement.start.col)));
            } else if (lineNo > statement.start.line && lineNo < statement.end.line) {
                line = colors.black(colors.bgRed(line));
            } else if (lineNo === statement.end.line) {
                line = colors.black(colors.bgRed(line.slice(0, statement.end.col))) +
                    line.slice(statement.end.col);
            }
            return colors.magenta(String(lineNo).padStart(gutterWidth, " ")) + "  " + line;
        })
        .join("\n") + "\n" +
        Array(statement.start.col + gutterWidth + 3).join(" ") + colors.red("↑");
    return codeContext;
}
