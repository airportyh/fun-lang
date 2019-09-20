const builtInFunctions = require("./built-in-functions");

exports.generateCode = function generateCode(ast) {
    const builtIns = Object.values(builtInFunctions).map(fn => fn.toString());
    const jsCode = ast.map(node => {
        return generateCodeForTopLevelStatement(node);
    })
    .concat(["main().catch(err => console.log(err.message));"])
    .concat(["// Built-in Functions:"])
    .concat(builtIns).join("\n\n");
    return jsCode;
}

function generateCodeForTopLevelStatement(node) {
    if (node.type === "comment") {
        return "//" + node.text;
    } else if (node.type === "fun_definition") {
        const line1 = "function " + node.name.text + "(" + node
            .parameters
            .map(p => p.text)
            .join(", ") + ") {"; 
        const body = indent(node.body.map(statement => {
            return generateCodeForExecutableStatement(statement);
        }).join("\n"));
        return line1 + "\n" + body + "\n}";
    } else if (node.type === "proc_definition") {
        const line1 = "async function " + node.name.text + "(" + 
            node.parameters
            .map(p => p.text).join(", ") + ") {"; 
        const body = indent(node.body.map(statement => {
            return generateCodeForExecutableStatement(statement);
        }).join("\n"));
        return line1 + "\n" + body + "\n}";
    } else {
        throw new Error("Unknown AST Node type: " + node.type);
    }
}

function generateCodeForExecutableStatement(statement) {
    if (statement.type === "comment") {
        return "//" + statement.text;
    } else if (statement.type === "return_statement") {
        return "return " + generateCodeForExpression(statement.value) + ";";
    } else if (statement.type === "var_assignment") {
        return "var " + statement.var_name.text + " = " + generateCodeForExpression(statement.value) + ";";
    } else if (statement.type === "call_expression") {
        return statement.fun_name.text + "(" + 
            statement.arguments.map(arg => generateCodeForExpression(arg))
                .join(", ") + ");";
    } else if (statement.type === "while_loop") {
        const condition = generateCodeForExpression(statement.condition);
        return "while (" + condition + ") {\n" +
            indent(statement.body.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")) + "\n}";
    } else if (statement.type === "if_statement") {
        const condition = generateCodeForExpression(statement.condition);
        const alternate = statement.alternate ? generateCodeForIfAlternate(statement.alternate) : "";
        return "if (" + condition + ") {\n" +
            indent(statement.consequent.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")) + "\n}" + alternate;
    } else if (statement.type === "for_loop") {
        const iterable = generateCodeForExpression(statement.iterable);
        return "for (let " + statement.loop_variable.text + " of " + iterable + ") {\n" +
            indent(statement.body.map(statement => {
                return generateCodeForExecutableStatement(statement);
            }).join("\n")) + "\n}";
    } else {
        throw new Error("Unknown AST node type: " + statement.type);
    }
}

function generateCodeForIfAlternate(alternate) {
    if (alternate.type === "if_statement") {
        return " else " + generateCodeForExecutableStatement(alternate);
    } else {
        return " else {\n" + 
            indent(alternate.map(statement => {
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
            return entry[0] + ": " + generateCodeForExpression(entry[1]);
        }).join(", ") + " }";
    } else if (expression.type === "binary_operation") {
        const left = generateCodeForExpression(expression.left);
        const right = generateCodeForExpression(expression.right);
        return left + " " + expression.operator.text + " " + right;
    } else if (expression.type === "var_reference") {
        return expression.var_name.text;
    } else if (expression.type === "call_expression") {
        return expression.fun_name.text + "(" +
            expression.arguments.map(generateCodeForExpression)
                .join(", ")
        + ")";
    } else {
        console.log("expression", expression);
        throw new Error("Unsupported type: " + expression.type);
    }
}

function indent(str) {
    return str.split("\n").map(line => "    " + line).join("\n");
}