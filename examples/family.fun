proc main() [
    dad = { name: "Toby" }
    mom = { name: "Weilai" }
    dad["spouse"] = mom
    mom["spouse"] = dad
    marty = { name: "Marty" }
    emma = { name: "Emma" }
    linus = { name: "Linus" }

    children = [marty, emma, linus]

    mom["children"] = children
    dad["children"] = children

    marty["siblings"] = [emma, linus]
    linus["siblings"] = [emma, marty]
    emma["siblings"] = [linus, marty]

    for child in children [
        child["father"] = dad
        child["mother"] = mom
    ]
]
