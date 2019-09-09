@{%
const lexer = require("./lexer");
%}

@lexer lexer

input -> top_level_statements {% id %}

top_level_statements
    -> _ "\n" top_level_statements
        {%
            d => d[2]
        %}
    |  top_level_statement
        {%
            d => [d[0]]
        %}
    |  top_level_statement _ "\n" _ top_level_statements
        {%
            d => [
                d[0],
                ...d[4]
            ]
        %}

top_level_statement
    -> fun_definition   {% id %}
    |  proc_definition  {% id %}
    |  line_comment     {% id %}

fun_definition
    -> "fun" __ identifier _ "(" _ parameter_list _ ")" _ block
        {%
            d => ({
                type: "fun_definition",
                name: d[2],
                parameters: d[6],
                body: d[10]
            })
        %}

proc_definition
    -> "proc" __ identifier _ "(" _ parameter_list _ ")" _ block
        {%
            d => ({
                type: "proc_definition",
                name: d[2],
                parameters: d[6],
                body: d[10]
            })
        %}

parameter_list
    -> null        {% () => [] %}
    | identifier   {% d => [d[0]] %}
    | identifier _ "," _ parameter_list
        {%
            d => [d[0], ...d[4]]
        %}

block -> "[" executable_statements "]"
    {%
        (d) => d[1]
    %}

executable_statements
    -> _
        {% () => [] %}
    |  _ "\n" executable_statements
        {% (d) => d[2] %}
    |  _ executable_statement _
        {% d => [d[1]] %}
    |  _ executable_statement _ "\n" executable_statements
        {%
            d => [d[1], ...d[4]]
        %}

executable_statement
   -> var_assignment       {% id %}
   |  return_statement     {% id %}
   |  call_expression      {% id %}
   |  line_comment         {% id %}
   |  indexed_assignment   {% id %}

var_assignment
    -> identifier _ "=" _ expression
        {%
            d => ({
                type: "var_assignment",
                var_name: d[0],
                value: d[4]
            })
        %}

indexed_access
    -> unary_expression _ "[" _ expression _ "]"
        {%
            d => ({
                type: "indexed_access",
                subject: d[0],
                index: d[4]
            })
        %}

indexed_assignment
    -> unary_expression _ "[" _ expression _ "]" _ "=" _ expression
        {%
            d => ({
                type: "indexed_assignment",
                subject: d[0],
                index: d[4],
                value: d[10]
            })
        %}

return_statement
    -> "return" __ expression
        {%
            d => ({
                type: "return_statement",
                value: d[2]
            })
        %}

call_expression
    -> identifier _ "(" argument_list ")"
        {%
            d => ({
                type: "call_expression",
                fun_name: d[0],
                arguments: d[3]
            })
        %}

argument_list
    -> null {% () => [] %}
    |  _ expression _  {% d => [d[1]] %}
    |  _ expression _ "," argument_list
        {%
            d => [d[1], ...d[4]]
        %}

expression -> additive_expression         {% id %}

additive_expression
    -> multiplicative_expression    {% id %}
    |  multiplicative_expression _ [+-] _ additive_expression
        {%
            d => ({
                type: "binary_operation",
                operator: d[2],
                left: d[0],
                right: d[4]
            })
        %}

multiplicative_expression
    -> unary_expression     {% id %}
    |  unary_expression _ [*/] _ multiplicative_expression
        {%
            d => ({
                type: "binary_operation",
                operator: d[2],
                left: d[0],
                right: d[4]
            })
        %}

unary_expression
    -> number               {% id %}
    |  identifier
        {%
            d => ({
                type: "var_reference",
                var_name: d[0]
            })
        %}
    |  call_expression      {% id %}
    |  string_literal       {% id %}
    |  list_literal         {% id %}
    |  dictionary_literal   {% id %}
    |  indexed_access       {% id %}

list_literal
    -> "[" list_items "]"
        {%
            d => ({
                type: "list_literal",
                items: d[1]
            })
        %}

list_items
    -> null
        {% () => [] %}
    |  _ expression _
        {% d => [d[1]] %}
    |  _ expression _ "," list_items
        {%
            d => [
                d[1],
                ...d[4]
            ]
        %}

dictionary_literal
    -> "{" dictionary_entries "}"
        {% 
            d => ({
                type: "dictionary_literal",
                entries: d[1]
            })
        %}

dictionary_entries
    -> null  {% () => [] %}
    |  _ dictionary_entry _
        {%
            d => [d[1]]
        %}
    |  _ dictionary_entry _ "," dictionary_entries
        {%
            d => [d[1], ...d[4]]
        %}

dictionary_entry
    -> identifier _ ":" _ expression
        {%
            d => [d[0], d[4]]
        %}

line_comment -> %comment {% id %}

string_literal -> %string_literal {% id %}

number -> %number_literal {% id %}

identifier -> %identifier {% id %}

__ -> %ws:+

_ -> %ws:*