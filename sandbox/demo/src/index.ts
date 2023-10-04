import { match, any, pattern, _ } from "patternmatcher"

const point = { x: 123, y: 123 }
match(point)(
  [{ x: 123, y: any(Number) }, () => console.log("x is 123 and y is a number")],
  [_, () => console.log("no match")]
)

match("123")(
  [pattern(/^[0-9]+$/), () => console.log("value is a string of numbers")],
  [_, () => console.log("value is not a string of numbers")]
)

match("Hello World")(
  [pattern(/^[a-zA-Z ]+$/), () => console.log("value is a string of letters")],
  [pattern(/^[0-9]+$/), () => console.log("value is a string of numbers")],
  [_, () => console.log("value is not a string of letters or numbers")]
)

const returnVal = match(123)(
  [Number, () => "value is a number" as const],
  [String, () => 123]
)

console.log("returnVal: ", returnVal)
