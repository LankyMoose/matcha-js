import { match, _, type } from "matcha-js"

const expected = 42
const actual = match([1, 2, 3, 4, 5, {}, new Date(), null])(
  [[...type(Number), ..._, type(String)], () => expected],
  [_, () => console.log("no match")]
)

console.log(`actual: ${actual}, expected: ${expected}`)
