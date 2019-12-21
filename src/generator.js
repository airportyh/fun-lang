const builtInFunctions = require("./built-in-functions");
const indent = require("./indent");
const path = require("path");

const runtimeCode = `// Runtime functions
const jsonr = require("@airportyh/jsonr");
const $history = [];
let $stack = [];
let $nextHeapId = 1;
let $heap = {};

function $pushFrame(funName, variables, line) {
    $recordLine(line);
    const newFrame = { funName, parameters: variables, variables };
    $stack = [...$stack, newFrame];
}

function $popFrame(line) {
    $recordLine(line);
    $stack = $stack.slice(0, $stack.length - 1);
}

function $setVariable(varName, value, line) {
    $recordLine(line);
    const frame = $stack[$stack.length - 1];
    const newFrame = {
        ...frame,
        variables: { ...frame.variables, [varName]: value }
    };
    $stack = [...$stack.slice(0, $stack.length - 1), newFrame];
}

function $heapAllocate(value) {
    const id = $nextHeapId;
    $nextHeapId++;
    $heap = {
        ...$heap,
        [id]: value
    };
    return id;
}

function $recordLine(line) {
    $history.push({ line, stack: $stack, heap: $heap });
}

function $getVariable(varName) {
    return $stack[$stack.length - 1].variables[varName];
}

function $heapAccess(id) {
    return $heap[id];
}

function $get(id, index) {
    const object = $heap[id];
    return object[index];
}

function $set(id, index, value) {
    const object = $heap[id];
    let newObject;
    if (Array.isArray(object)) {
        newObject = object.slice();
        newObject[index] = value;
    } else {
        newObject = {
            ...$heap[id],
            [index]: value
        };
    }
    $heap = {
        ...$heap,
        [id]: newObject
    };
}

function $saveHistory(filePath) {
    require("fs").writeFile(
        filePath,
        jsonr.stringify($history, "	"),
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
            `var $retval = ${generateCodeForExpression(statement.value)};`,
            `$setVariable("<ret val>", $retval, ${statement.start.line});`,
            `return $retval;`
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
        const loopVar = statement.loop_variable.value;
        const loopTopLine = statement.loop_variable.start.line;
        return [
            `for (let ${loopVar} of $heapAccess(${generateCodeForExpression(statement.iterable)})) {`,
            indent(`$setVariable("${loopVar}", ${loopVar}, ${loopTopLine});`),
            indent(statement.body.statements.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")),
            "}"
        ].join("\n");
    } else if (statement.type === "indexed_assignment") {
        const subject = generateCodeForExpression(statement.subject);
        const index = generateCodeForExpression(statement.index);
        const value = generateCodeForExpression(statement.value);
        return `$set(${subject}, ${index}, ${value});`;
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
        const arrayLiteral = "[" + expression.items
            .map(generateCodeForExpression).join(", ") + "]";
        return `$heapAllocate(${arrayLiteral})`;
    } else if (expression.type === "dictionary_literal") {
        const dictLiteral = "{ " + expression.entries.map(entry => {
            return entry[0].value + ": " + generateCodeForExpression(entry[1]);
        }).join(", ") + " }";
        return `$heapAllocate(${dictLiteral})`;
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
        return `$get(${subject}, ${index})`;
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
