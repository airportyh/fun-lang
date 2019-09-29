fun hello() [
	return map(fun(n) [
		print(n)
		return n * 2
	], [1, 2])
]

proc main() [
	print(hello())
]