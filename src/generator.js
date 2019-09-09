
exports.generateCode = function generateCode(ast) {
    const jsCode = ast.map(node => {
        return generateCodeForTopLevelStatement(node);
    }).join("\n\n");
    return jsCode;
}

function generateCodeForTopLevelStatement(node) {
    if (node.type === "comment") {
        return "//" + node.text;
    } else if (node.type === "fun_definition") {
        const line1 = "function " + node.name + "(" + node.parameters.join(", ") + ") {"; 
        const body = node.body.map(statement => {
            return "    " + generateCodeForExecutableStatement(statement);
        }).join("\n");
        return line1 + "\n" + body + "\n}";
    } else if (node.type === "proc_definition") {
        const line1 = "async function " + node.name + "(" + node.parameters.join(", ") + ") {"; 
        const body = node.body.map(statement => {
            return "    " + generateCodeForExecutableStatement(statement);
        }).join("\n");
        return line1 + "\n" + body + "\n}";
    } else {
        throw new Error("BLARG");
    }
}

function generateCodeForExecutableStatement(statement) {
    if (statement.type === "comment") {
        return "//" + statement.text;
    } else if (statement.type === "return_statement") {
        return "return " + generateCodeForExpression(statement.value) + ";";
    } else if (statement.type === "var_assignment") {
        return "var " + statement.var_name + " = " + generateCodeForExpression(statement.value) + ";";
    } else if (statement.type === "call_expression") {
        return statement.fun_name + "(" + 
            statement.arguments.map(arg => generateCodeForExpression(arg))
                .join(", ") + ");";
    } else {
        throw new Error("BLARG");
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
        return left + " " + expression.operator + " " + right;
    } else if (expression.type === "var_reference") {
        return expression.var_name;
    } else if (expression.type === "call_expression") {
        return expression.fun_name + "(" +
            expression.arguments.map(generateCodeForExpression)
                .join(", ")
        + ")";
    } else {
        console.log("experssion", expression);
        throw new Error("Unsupported type: " + expression.type);
    }
}