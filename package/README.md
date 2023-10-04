# **PatternMatcher**

#### _A super simple pattern-matching package for javascript, with zero dependencies._

<br />

Usage:

```js
import { match, _ } from "patternmatcher"

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
import { match, any } from "patternmatcher"

const point = { x: 1, y: 2 }

match(point)(
  [{ x: 1, y: 2 }, () => console.log("point is 1, 2")],
  [{ x: 1, y: any(Number) }, () => console.log("point is 1, (a number)")],
  [{ x: any(Number), y: 2 }, () => console.log("point is (a number), 2")]
)
```

Classes:

```js
import { match } from "patternmatcher"

const value = "Hello World"

match(value)(
  [String, () => console.log("value is a string")],
  [Number, () => console.log("value is a number")]
)
```

Patterns:

```js
import { match } from "patternmatcher"

const value = "Supercalifragilisticexpialidocious"

match(value)(
  [/^[a-zA-Z]+$/, () => console.log("value is a string of letters")],
  [/^[0-9]+$/, () => console.log("value is a string of numbers")]
)
```
