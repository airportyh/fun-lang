// this is a function definition

function hello() {
	// this is a return statement
	return "Hello, world!";
}

function distance(x1, y1, x2, y2) {
	var delta_x = x1 - x2;
	var delta_y = y1 - y2;
	return sqrt(sqr(delta_x) + sqr(delta_y));
}

async function print_hello() {
	print(hello());
}

async function main(argv) {
	var numbers = [1, 2, 3, 4, 5];
	var mapping = { name: "Bob", age: 8 };
	print_hello();
}