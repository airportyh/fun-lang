proc say(message) [
    print(message)
]

fun hello() [
    answer = say("Hello")
]

proc main() [
    print(hello())
]