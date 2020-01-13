# https://www.codewars.com/kata
# /583203e6eb35d7980400002a/train/javascript

proc main() [
    print(count_smileys([]), 0)
    print(count_smileys([":D",":~)",";~D",":)"]), 4)
    print(count_smileys([":)",":(",":D",":O",":;"]), 2)
    print(count_smileys([";]", ":[", ";*", ":$", ";-D"]), 1)
]

fun count_smileys(faces) [
    return count(filter(fun (face) [
        has_eyes = face[0] == ":" or face[0] == ";"
        has_nose = face[1] == "~" or face[1] == "-"
        if has_nose [
            return has_eyes and (face[2] == "D" or face[2] == ")")
        ] else [
            return has_eyes and (face[1] == "D" or face[1] == ")")
        ]
    ], faces))
]
