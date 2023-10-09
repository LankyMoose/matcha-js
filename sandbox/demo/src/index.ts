import { match, optional, _ } from "matcha-js"

// match({ a: 1, b: 2 })(
//   [{ a: type(Number), b: "asd", ..._ }, () => console.log("matched")],
//   [_, () => console.log("no match")]
// )

// match({})(
//   [{ a: optional(Number), b: 123 }, () => console.log("matched")],
//   [_, () => console.log("nope")]
// )

match({ x: 1, y: 2, z: 3 })(
  [{ x: 1, ..._, a: 123 }, () => console.log("matched")],
  [_, () => console.log("nope")]
)
