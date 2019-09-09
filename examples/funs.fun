fun distance(x1, y1, x2, y2) [
    return sqrt(sqr(x1 - x2) + sqr(x2 - y2))
]

proc main () [
    print(distance(34, 96, 23, 56))
]