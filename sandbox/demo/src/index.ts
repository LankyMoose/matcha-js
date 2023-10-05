import { match, type, _ } from "matcha-js"

// match({ a: 1, b: 2 })(
//   [{ a: type(Number), b: "asd", ..._ }, () => console.log("matched")],
//   [_, () => console.log("no match")]
// )

match({ x: 1, y: { z: 2, a: "test" } })(
  [{ x: 1, y: { z: type(Number), ..._ } }, () => console.log("matched")],
  [_, () => console.log("no match")]
)
