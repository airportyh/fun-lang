fun hello(subject) [
    if subject [
        print("Hello, " + subject + "!")
    ] else [
        print("Hello, world!")
    ]
]

proc main() [
    hello("Bob")
]