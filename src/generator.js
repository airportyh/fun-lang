const builtInFunctions = require("./built-in-functions");
const indent = require("./indent");
const path = require("path");

const runtimeCode = `// Runtime functions
const $history = [];
let $stack = [];

function $pushFrame(funName, variables, line) {
    $history.push({ line, stack: $stack });
    const newFrame = { funName, variables };
    $stack = [...$stack, newFrame];
}

function $popFrame(line) {
    $history.push({ line, stack: $stack });
    $stack = $stack.slice(0, $stack.length - 1);
}

function $setVariable(varName, value, line) {
    $history.push({ line, stack: $stack });
    const frame = $stack[$stack.length - 1];
    const newFrame = {
        funName: frame.funName,
        variables: { ...frame.variables, [varName]: value }
    };
    $stack = [...$stack.slice(0, $stack.length - 1), newFrame];
}

function $recordLine(line) {
    $history.push({ line, stack: $stack });
}

function $getVariable(varName) {
    return $stack[$stack.length - 1].variables[varName];
}

function $saveHistory(filePath) {
    require("fs").writeFile(
        filePath,
        JSON.stringify($history, null, "	"),
        () => undefined
    );
}`;

exports.generateCode = function generateCode(ast, options) {
    const builtIns = Object.values(builtInFunctions).map(fn => fn.code);

    const jsCode =
    [runtimeCode]
    .concat(
        ast.map(node => {
            return generateCodeForTopLevelStatement(node);
        })
    )
    .concat([`main().catch(err => console.log(err.message))`
        + (options.historyFilePath ?
            `.finally(() => $saveHistory("${options.historyFilePath}"));` :
            "")])
    .concat(["// Built-in Functions:"])
    .concat(builtIns)
    .join("\n\n");
    return jsCode;
}

// Node is either fun_definition or proc_definition
function generateFunction(node) {
    const isAsync = node.type === "proc_definition";
    const firstLine = node.body.start.line;
    const lastLine = node.body.end.line;
    const funName = node.name.value;
    const parameters = node
        .parameters
        .map(p => p.value)
        .join(", ");
    const line1 = (isAsync ? "async " : "") +
        "function " + funName + "(" + parameters + ") {";
    const body = generateCodeForCodeBlock(node.body);
    return [
        line1,
        indent(`$pushFrame("${funName}", { ${parameters} }, ${firstLine});`),
        indent(`try {`),
        indent(body),
        indent(`} finally {`),
        indent(indent(`$popFrame(${lastLine});`)),
        indent(`}`),
        "}"
    ].join("\n");
}

function generateCodeForTopLevelStatement(node) {
    if (node.type === "comment") {
        return "//" + node.value;
    } else if (node.type === "fun_definition") {
        return generateFunction(node);
    } else if (node.type === "proc_definition") {
        return generateFunction(node);
    } else {
        throw new Error("Unknown AST Node type for top level statements: " + node.type);
    }
}

function generateCallExpression(expression) {
    const line = expression.start.line;
    const funcCall = expression.fun_name.value + "(" +
        expression.arguments.map(arg => generateCodeForExpression(arg))
            .join(", ") + ")";
    return `($recordLine(${line}), ${funcCall})`;
}

function generateCodeForExecutableStatement(statement) {
    if (statement.type === "comment") {
        return "//" + statement.value;
    } else if (statement.type === "return_statement") {
        return [
            `$recordLine(${statement.start.line});`,
            `return ${generateCodeForExpression(statement.value)};`
        ].join("\n");
        return "return " + generateCodeForExpression(statement.value) + ";";
    } else if (statement.type === "var_assignment") {
        // return "var " + statement.var_name.value + " = " + generateCodeForExpression(statement.value) + ";";
        const varName = statement.var_name.value;
        const value = generateCodeForExpression(statement.value);
        const line = statement.start.line;
        return `$setVariable("${varName}", ${value}, ${line});`;
    } else if (statement.type === "call_expression") {
        return generateCallExpression(statement) + ";";
    } else if (statement.type === "while_loop") {
        const condition = generateCodeForExpression(statement.condition);
        return "while (" + condition + ") {\n" +
            generateCodeForCodeBlock(statement.body) +
            "\n}";
    } else if (statement.type === "if_statement") {
        const condition = generateCodeForExpression(statement.condition);
        const alternate = statement.alternate ?
            generateCodeForIfAlternate(statement.alternate) : "";
        return [
            `$recordLine(${statement.condition.start.line});`,
            `if (${condition}) {`,
            indent(statement.consequent.statements.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")),
            "}",
            alternate
        ].join("\n");
    } else if (statement.type === "for_loop") {
        const iterable = generateCodeForExpression(statement.iterable);
        return "for (let " + statement.loop_variable.value + " of " + iterable + ") {\n" +
            indent(statement.body.statements.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")) + "\n}";
    } else if (statement.type === "indexed_assignment") {
        const subject = generateCodeForExpression(statement.subject);
        const index = generateCodeForExpression(statement.index);
        const value = generateCodeForExpression(statement.value);
        return `${subject}[${index}] = ${value}`;
    } else {
        throw new Error("Unknown AST node type for executable statements: " + statement.type);
    }
}

function generateCodeForIfAlternate(alternate) {
    if (alternate.type === "if_statement") {
        return " else " + generateCodeForExecutableStatement(alternate);
    } else {
        return " else {\n" +
            indent(alternate.statements.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")) + "\n}";
    }
}

const operatorMap = {
    ">": ">",
    ">=": ">=",
    "<": "<",
    "<=": "<=",
    "==": "===",
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/"
};

function generateCodeForExpression(expression) {
    if (expression.type === "string_literal") {
        return JSON.stringify(expression.value);
    } else if (expression.type === "number_literal") {
        return String(expression.value);
    } else if (expression.type === "list_literal") {
        return "[" + expression.items
            .map(generateCodeForExpression).join(", ") + "]";
    } else if (expression.type === "dictionary_literal") {
        return "{ " + expression.entries.map(entry => {
            return entry[0].value + ": " + generateCodeForExpression(entry[1]);
        }).join(", ") + " }";
    } else if (expression.type === "binary_operation") {
        const left = generateCodeForExpression(expression.left);
        const right = generateCodeForExpression(expression.right);
        return left + " " + operatorMap[expression.operator.value] + " " + right;
    } else if (expression.type === "var_reference") {
        return `$getVariable("${expression.var_name.value}")`;
        // return expression.var_name.value;
    } else if (expression.type === "call_expression") {
        return generateCallExpression(expression);
    } else if (expression.type === "indexed_access") {
        const subject = generateCodeForExpression(expression.subject);
        const index = generateCodeForExpression(expression.index);
        return `${subject}[${index}]`;
    } else if (expression.type === "fun_expression") {
        return "function (" + expression.parameters.map(p => p.value).join(", ") + ") {\n" +
            generateCodeForCodeBlock(expression.body) +
            "\n}";
    } else {
        throw new Error("Unsupported AST node type for expressions: " + expression.type);
    }
}

function generateCodeForCodeBlock(codeBlock) {
    return indent(codeBlock.statements.map(
        statement => generateCodeForExecutableStatement(statement))
    .join("\n"));
}
