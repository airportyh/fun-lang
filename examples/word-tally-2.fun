proc main() [
    sentence = "to be or not to be"
    words = split(sentence, " ")
    tally = reduce(fun (tally, word) [
        if tally[word] [
            tally[word] = tally[word] + 1
        ] else [
            tally[word] = 1
        ]
        return tally
    ], {}, words)
]
