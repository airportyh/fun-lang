// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "input", "symbols": ["top_level_statements"], "postprocess": id},
    {"name": "top_level_statements", "symbols": ["_", {"literal":"\n"}, "top_level_statements"], "postprocess": 
        d => d[2]
                },
    {"name": "top_level_statements", "symbols": ["top_level_statement"], "postprocess": 
        d => [d[0]]
                },
    {"name": "top_level_statements", "symbols": ["top_level_statement", "_", {"literal":"\n"}, "_", "top_level_statements"], "postprocess": 
        d => [
            d[0],
            ...d[4]
        ]
                },
    {"name": "top_level_statement", "symbols": ["fun_definition"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["proc_definition"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "fun_definition$string$1", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "fun_definition", "symbols": ["fun_definition$string$1", "__", "identifier", "_", {"literal":"("}, "_", "parameter_list", "_", {"literal":")"}, "_", "block"], "postprocess": 
        d => ({
            type: "fun_definition",
            name: d[2],
            parameters: d[6],
            body: d[10]
        })
                },
    {"name": "proc_definition$string$1", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"o"}, {"literal":"c"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "proc_definition", "symbols": ["proc_definition$string$1", "__", "identifier", "_", {"literal":"("}, "_", "parameter_list", "_", {"literal":")"}, "_", "block"], "postprocess": 
        d => ({
            type: "proc_definition",
            name: d[2],
            parameters: d[6],
            body: d[10]
        })
                },
    {"name": "parameter_list", "symbols": [], "postprocess": () => []},
    {"name": "parameter_list", "symbols": ["identifier"], "postprocess": d => [d[0]]},
    {"name": "parameter_list", "symbols": ["identifier", "_", {"literal":","}, "_", "parameter_list"], "postprocess": 
        d => [d[0], ...d[4]]
                },
    {"name": "block", "symbols": [{"literal":"["}, "executable_statements", {"literal":"]"}], "postprocess": 
        (d) => d[1]
            },
    {"name": "executable_statements", "symbols": ["_"], "postprocess": () => []},
    {"name": "executable_statements", "symbols": ["_", {"literal":"\n"}, "executable_statements"], "postprocess": (d) => d[2]},
    {"name": "executable_statements", "symbols": ["_", "executable_statement", "_"], "postprocess": d => [d[1]]},
    {"name": "executable_statements", "symbols": ["_", "executable_statement", "_", {"literal":"\n"}, "executable_statements"], "postprocess": 
        d => [d[1], ...d[4]]
                },
    {"name": "executable_statement", "symbols": ["var_assignment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["return_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["call_expression"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["indexed_assignment"], "postprocess": id},
    {"name": "var_assignment", "symbols": ["identifier", "_", {"literal":"="}, "_", "expression"], "postprocess": 
        d => ({
            type: "var_assignment",
            var_name: d[0],
            value: d[4]
        })
                },
    {"name": "indexed_access", "symbols": ["unary_expression", "_", {"literal":"["}, "_", "expression", "_", {"literal":"]"}], "postprocess": 
        d => ({
            type: "indexed_access",
            subject: d[0],
            index: d[4]
        })
                },
    {"name": "indexed_assignment", "symbols": ["unary_expression", "_", {"literal":"["}, "_", "expression", "_", {"literal":"]"}, "_", {"literal":"="}, "_", "expression"], "postprocess": 
        d => ({
            type: "indexed_assignment",
            subject: d[0],
            index: d[4],
            value: d[10]
        })
                },
    {"name": "return_statement$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "return_statement", "symbols": ["return_statement$string$1", "__", "expression"], "postprocess": 
        d => ({
            type: "return_statement",
            value: d[2]
        })
                },
    {"name": "call_expression", "symbols": ["identifier", "_", {"literal":"("}, "argument_list", {"literal":")"}], "postprocess": 
        d => ({
            type: "call_expression",
            fun_name: d[0],
            arguments: d[3]
        })
                },
    {"name": "argument_list", "symbols": [], "postprocess": () => []},
    {"name": "argument_list", "symbols": ["_", "expression", "_"], "postprocess": d => [d[1]]},
    {"name": "argument_list", "symbols": ["_", "expression", "_", {"literal":","}, "_", "argument_list"], "postprocess": 
        d => [d[1], ...d[5]]
                },
    {"name": "expression", "symbols": ["additive_expression"], "postprocess": id},
    {"name": "additive_expression", "symbols": ["multiplicative_expression"], "postprocess": id},
    {"name": "additive_expression", "symbols": ["multiplicative_expression", "_", /[+-]/, "_", "additive_expression"], "postprocess": 
        d => ({
            type: "binary_operation",
            operator: d[2],
            left: d[0],
            right: d[4]
        })
                },
    {"name": "multiplicative_expression", "symbols": ["unary_expression"], "postprocess": id},
    {"name": "multiplicative_expression", "symbols": ["unary_expression", "_", /[*\/]/, "_", "multiplicative_expression"], "postprocess": 
        d => ({
            type: "binary_operation",
            operator: d[2],
            left: d[0],
            right: d[4]
        })
                },
    {"name": "unary_expression", "symbols": ["number"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["identifier"], "postprocess": 
        d => ({
            type: "var_reference",
            var_name: d[0]
        })
                },
    {"name": "unary_expression", "symbols": ["call_expression"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["string_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["list_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["dictionary_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["indexed_access"], "postprocess": id},
    {"name": "list_literal", "symbols": [{"literal":"["}, "list_items", {"literal":"]"}], "postprocess": 
        d => ({
            type: "list_literal",
            items: d[1]
        })
                },
    {"name": "list_items", "symbols": [], "postprocess": () => []},
    {"name": "list_items", "symbols": ["_", "expression", "_"], "postprocess": d => [d[1]]},
    {"name": "list_items", "symbols": ["_", "expression", "_", {"literal":","}, "list_items"], "postprocess": 
        d => [
            d[1],
            ...d[4]
        ]
                },
    {"name": "dictionary_literal", "symbols": [{"literal":"{"}, "dictionary_entries", {"literal":"}"}], "postprocess":  
        d => ({
            type: "dictionary_literal",
            entries: d[1]
        })
                },
    {"name": "dictionary_entries", "symbols": [], "postprocess": () => []},
    {"name": "dictionary_entries", "symbols": ["_", "dictionary_entry", "_"], "postprocess": 
        d => [d[1]]
                },
    {"name": "dictionary_entries", "symbols": ["_", "dictionary_entry", "_", {"literal":","}, "dictionary_entries"], "postprocess": 
        d => [d[1], ...d[4]]
                },
    {"name": "dictionary_entry", "symbols": ["identifier", "_", {"literal":":"}, "_", "expression"], "postprocess": 
        d => [d[0], d[4]]
                },
    {"name": "line_comment$ebnf$1", "symbols": []},
    {"name": "line_comment$ebnf$1", "symbols": ["line_comment$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "line_comment", "symbols": [{"literal":"#"}, "line_comment$ebnf$1"], "postprocess": 
        d => ({
            type: "comment",
            text: d[1].join("")
        })
                },
    {"name": "string_literal", "symbols": [{"literal":"\""}, "string_characters", {"literal":"\""}], "postprocess": 
        d => ({
            type: "string_literal",
            value: d[1]
        })
                },
    {"name": "string_characters$ebnf$1", "symbols": []},
    {"name": "string_characters$ebnf$1", "symbols": ["string_characters$ebnf$1", "string_character"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string_characters", "symbols": ["string_characters$ebnf$1"], "postprocess": 
        d => d[0].join("")
            },
    {"name": "string_character", "symbols": [/[^\"\\]/], "postprocess": id},
    {"name": "string_character", "symbols": [{"literal":"\\"}, "escape_character"], "postprocess": 
        d => d[1]
                },
    {"name": "escape_character", "symbols": [{"literal":"\""}], "postprocess": () => '"'},
    {"name": "escape_character", "symbols": [{"literal":"\\"}], "postprocess": () => "\\"},
    {"name": "escape_character", "symbols": [{"literal":"/"}], "postprocess": () => "/"},
    {"name": "escape_character", "symbols": [{"literal":"b"}], "postprocess": () => "\b"},
    {"name": "escape_character", "symbols": [{"literal":"f"}], "postprocess": () => "\f"},
    {"name": "escape_character", "symbols": [{"literal":"n"}], "postprocess": () => "\n"},
    {"name": "escape_character", "symbols": [{"literal":"r"}], "postprocess": () => "\r"},
    {"name": "escape_character", "symbols": [{"literal":"t"}], "postprocess": () => "\t"},
    {"name": "number", "symbols": ["digits", {"literal":"."}, "digits"], "postprocess": 
        d => ({
            type: "number_literal",
            value: Number(d[0] + "." + d[2])
        })
                },
    {"name": "number", "symbols": ["digits"], "postprocess": 
        d => ({
            type: "number_literal",
            value: Number(d[0])
        })
                },
    {"name": "digits$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "digits$ebnf$1", "symbols": ["digits$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "digits", "symbols": ["digits$ebnf$1"], "postprocess": d => d[0].join("")},
    {"name": "identifier$ebnf$1", "symbols": []},
    {"name": "identifier$ebnf$1", "symbols": ["identifier$ebnf$1", /[a-z_0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "identifier", "symbols": [/[a-z_]/, "identifier$ebnf$1"], "postprocess": 
        d => d[0] + d[1].join("")
            },
    {"name": "__$ebnf$1", "symbols": [/[ \t]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
