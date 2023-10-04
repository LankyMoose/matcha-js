# **PatternMatcher**

#### _A super simple pattern-matching package for javascript, with zero dependencies._

<br />

Usage:

```js
import { match, _ } from "matcha-js"

const x = 1

match(x)(
  [1, () => console.log("one")],
  [2, () => console.log("two")],
  [3, () => console.log("three")]
)
// "one"

const y = match(42)(
  [1, () => "one"],
  [2, () => "two"],
  [3, () => "three"],
  [_, () => "something else"]
)

console.log(y) // "something else"
```

Objects:

```js
import { match, any } from "matcha-js"

const point = { x: 1, y: 2 }

match(point)(
  [{ x: 1, y: 42 }, () => console.log("point is 1, 42")],
  [{ x: 1, y: any(Number) }, () => console.log("point is 1, (a number)")],
  [{ x: any(Number), y: 2 }, () => console.log("point is (a number), 2")]
)
// "point is 1, (a number)"
```

Classes:

```js
import { match } from "matcha-js"

const value = "Hello World"

match(value)(
  [String, () => console.log("value is a string")],
  [Number, () => console.log("value is a number")]
)
// "value is a string"
```

Patterns:

```js
import { match } from "matcha-js"

const value = "Supercalifragilisticexpialidocious"

match(value)(
  [/^[a-zA-Z]+$/, () => console.log("value is a string of letters")],
  [/^[0-9]+$/, () => console.log("value is a string of numbers")]
)
// "value is a string of letters"
```

Complex matching:

```js
import { match, any, _ } from "matcha-js"

const value = { x: 1, y: { z: 2 } }

match(value)([
  { x: _, y: { z: any(Number) } },
  () => console.log("value is {x: _, y: { z: (a number) }}"),
])
```
