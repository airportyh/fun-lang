proc main() [
    sentence = "to be or not to be"
    words = split(sentence, " ")
    tally = {}
    for word in words [
        if tally[word] [
            tally[word] = tally[word] + 1
        ] else [
            tally[word] = 1
        ]
    ]
]
