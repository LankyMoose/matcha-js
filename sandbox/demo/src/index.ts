import { match, is, _, optional, type } from "matcha-js"

const someVariable: unknown = { x: 69, y: 0 }

const res = match(someVariable)(
  is({ y: 0 }, (val) => val),
  is({ x: 0, y: 42 }, () => 123),
  [_, () => 42]
)
console.log(res) // 42

const asd = match(someVariable)(
  is({ x: optional(Number), y: type(Number) }, (pt) =>
    match(pt.x)(
      is(Number, (n) => n * 3),
      [_, () => 42]
    )
  ),
  [_, () => 42]
)

console.log("asd", asd) // 42
