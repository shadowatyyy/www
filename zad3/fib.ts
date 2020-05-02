export function fib(x : number) : number {
	if (x <= 1)
		return x;

	return fib(x - 1) + fib(x - 2);
}