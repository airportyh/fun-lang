const builtInFunctions = require("./built-in-functions");
const indent = require("./indent");

exports.generateCode = function generateCode(ast) {
    const builtIns = Object.values(builtInFunctions).map(fn => fn.code);

    const jsCode = ast.map(node => {
        return generateCodeForTopLevelStatement(node);
    })
    .concat(["main().catch(err => console.log(err.message));"])
    .concat(["// Built-in Functions:"])
    .concat(builtIns)
    .join("\n\n");
    return jsCode;
}

function generateCodeForTopLevelStatement(node) {
    if (node.type === "comment") {
        return "//" + node.value;
    } else if (node.type === "fun_definition") {
        const line1 = "function " + node.name.value + "(" + node
            .parameters
            .map(p => p.value)
            .join(", ") + ") {";
        const body = generateCodeForCodeBlock(node.body);
        return line1 + "\n" + body + "\n}";
    } else if (node.type === "proc_definition") {
        const line1 = "async function " + node.name.value + "(" +
            node.parameters
            .map(p => p.value).join(", ") + ") {";
        const body = generateCodeForCodeBlock(node.body);
        return line1 + "\n" + body + "\n}";
    } else {
        throw new Error("Unknown AST Node type for top level statements: " + node.type);
    }
}

function generateCodeForExecutableStatement(statement) {
    if (statement.type === "comment") {
        return "//" + statement.value;
    } else if (statement.type === "return_statement") {
        return "return " + generateCodeForExpression(statement.value) + ";";
    } else if (statement.type === "var_assignment") {
        return "var " + statement.var_name.value + " = " + generateCodeForExpression(statement.value) + ";";
    } else if (statement.type === "call_expression") {
        return statement.fun_name.value + "(" +
            statement.arguments.map(arg => generateCodeForExpression(arg))
                .join(", ") + ");";
    } else if (statement.type === "while_loop") {
        const condition = generateCodeForExpression(statement.condition);
        return "while (" + condition + ") {\n" +
            generateCodeForCodeBlock(statement.body) +
            "\n}";
    } else if (statement.type === "if_statement") {
        const condition = generateCodeForExpression(statement.condition);
        const alternate = statement.alternate ? generateCodeForIfAlternate(statement.alternate) : "";
        return "if (" + condition + ") {\n" +
            indent(statement.consequent.statements.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")) + "\n}" + alternate;
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
        return left + " " + expression.operator.value + " " + right;
    } else if (expression.type === "var_reference") {
        return expression.var_name.value;
    } else if (expression.type === "call_expression") {
        return expression.fun_name.value + "(" +
            expression.arguments.map(generateCodeForExpression)
                .join(", ")
        + ")";
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
