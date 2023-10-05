import { match, type, _ } from "matcha-js"

match({ a: 1, b: 2 })(
  [{ a: type(Number), ..._ }, () => console.log("matched")],
  [_, () => console.log("no match")]
)
