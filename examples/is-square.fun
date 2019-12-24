# https://www.codewars.com/kata/54c27a33fb7da0db0100040e/train/c

fun is_square(n) [
    s = sqrt(n)
    return s * s == n
]

proc main() [
    print("is_square(1)", is_square(1))
    print("is_square(0)", is_square(0))
    print("is_square(3)", is_square(3))
    print("is_square(4)", is_square(4))
    print("is_square(25)", is_square(25))
    print("is_square(26)", is_square(26))
]
