proc main() [
    i = 1
    n = 50
    fib_i = 1
    fib_ii = 1
    while i <= n [
        print(fib_i)
        temp = fib_i + fib_ii
        fib_i = fib_ii
        fib_ii = temp
        i = i + 1
    ]
]