
# this is a function definition
fun hello() [
    total = 0
    total = 1
    # this is a return statement
    return "Hello, world!"
]

fun distance(x1, y1, x2, y2) [
    delta_x = x1 - x2
    delta_y = y1 - y2
    return sqrt(sqr(delta_x) + sqr(delta_y))
]

proc print_hello() [
    print(hello())
]

proc main(argv) [
    total = 0
    numbers = [1, 2, 3, 4, 5]
    ball[0][numbers[0]] = 2
    total = 1
    mapping = { name: "Bob", age: 8 }
    print_hello()
]