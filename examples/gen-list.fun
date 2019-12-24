proc main() [
    c = 1
    numbers = []
    while c <= 10 [
        push(numbers, c)
        c = c + 1
    ]
    numbers[5] = 777
    for num in numbers [
        print(num)
    ]
    print(numbers[0])
    print(numbers[1])
]
