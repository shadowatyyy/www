"use strict";
exports.__esModule = true;
function fib(x) {
    if (x <= 1)
        return x;
    return fib(x - 1) + fib(x - 2);
}
exports.fib = fib;
