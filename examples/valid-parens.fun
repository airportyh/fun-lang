proc main() [
    print(valid_parens("()"), true)
    print(valid_parens(")(()))"), false)
    print(valid_parens("("), false)
    print(valid_parens("(())((()())())"), true)
]

proc valid_parens(str) [
    left_paren_count = 0
    for chr in str [
        if chr == "(" [
            left_paren_count = left_paren_count + 1
        ] else if chr == ")" [
            if left_paren_count == 0 [
                return false
            ] else [
                left_paren_count = left_paren_count - 1
            ]
        ] else [
            return false
        ]
    ]
    return left_paren_count == 0
]
