import { match, any, pattern } from "patternmatcher"

const point = { x: 123, y: 123 }
match(point)
  .with([{ x: 123, y: any(Number) }, () => console.log("x is 123 and y is a number")])
  .orElse(() => console.log("no match"))

const numString = "123"
match(numString)
  .with([pattern(/^[0-9]+$/), () => console.log("value is a string of numbers")])
  .orElse(() => console.log("value is not a string of numbers"))

const value = "Hello World"

match(value)
  .with(
    [pattern(/^[a-zA-Z ]+$/), () => console.log("value is a string of letters")],
    [pattern(/^[0-9]+$/), () => console.log("value is a string of numbers")]
  )
  .orElse(() => console.log("no match"))
