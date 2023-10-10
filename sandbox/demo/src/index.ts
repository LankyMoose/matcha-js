import { match, is, _, optional, type } from "matcha-js"

const res = match({ x: 0, y: 0 })(
  is({ x: optional(Number), y: 0 }, (val) => val),
  is({ x: 0, y: 42 }, () => 123)
)

const someVariable: unknown = { x: 0, y: 0 }

match(someVariable)(
  is({ x: type(Number), y: type(Number) }, (pt) => console.log(pt.x, pt.y))
)

match(someVariable)(
  is([type(Number), type(Number)], (pt) => console.log(pt[0], pt[1]))
)
