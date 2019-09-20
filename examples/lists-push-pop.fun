proc main() [
    names = ["Darren", "Kwan", "James", "Merrin"]
    push(names, "Karen")
    removed = pop(names)
    print("Removed", removed)
    print(names)
]