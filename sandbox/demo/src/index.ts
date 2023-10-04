import { match, type, _, optional, nullable } from "matcha-js"

// const point = { x: 123, y: 123 }
// match(point)(
//   [
//     { x: 123, y: type(Number) },
//     () => console.log("x is 123 and y is a number"),
//   ],
//   [_, () => console.log("no match")]
// )

// match("Hello")(
//   [/^[a-zA-Z]+$/, () => console.log("value is a string of letters")],
//   [/^[0-9]+$/, () => console.log("value is a string of numbers")],
//   [_, () => console.log("value is not a string of letters or numbers")]
// )

// match([1, 2, 3])(
//   [[], () => console.log("value is an empty array")],
//   [[1, 2, 3], () => console.log("value is an array of 1, 2, and 3")],
//   [_, () => console.log("no match")]
// )

// const returnVal = match(123)(
//   [Number, 456],
//   [String, "Hello World"],
//   [Boolean, true]
// )

// console.log("returnVal: ", returnVal)

match({ a: 123, b: null })([
  { a: type(Array, Number), b: nullable(String) },
  () => console.log("matched"),
])
