# https://www.codewars.com
# /kata/55bf01e5a717a0d57e0000ec/train/javascript

proc main() [
    print(persistence(39), 3)
    print(persistence(4), 0)
    print(persistence(25), 2)
    print(persistence(999), 4)
]

proc persistence(n) [
    return persistence_helper(n, 0)
]

proc persistence_helper(n, times) [
    if n < 10 [
        return times
    ]
    product = 1
    while n > 0 [
        digit = n % 10
        n = floor(n / 10)
        product = product * digit
    ]
    return persistence_helper(product, times + 1)
]
