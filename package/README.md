# **PatternMatcher**

#### _A super simple pattern-matching package for javascript, with zero dependencies._

<br />

Usage:

```js
import { match } from "patternmatcher"

const x = 1

match(x)
  .with(
    [1, () => console.log("one")],
    [2, () => console.log("two")],
    [3, () => console.log("three")],
    [Number, () => console.log("number")]
  )
  .orElse(() => console.log("no match"))
```

Objects:

```js
import { match, any } from "patternmatcher"

const point = { x: 1, y: 2 }

match(point)
  .with(
    [{ x: 1, y: 2 }, () => console.log("point is 1, 2")],
    [{ x: 1, y: any(Number) }, () => console.log("point is 1, something")],
    [{ x: any(Number), y: 2 }, () => console.log("point is something, 2")]
  )
  .orElse(() => console.log("no match"))
```

Classes:

```js
import { match, any } from "patternmatcher"

const value = "Hello World"

match(value)
  .with(
    [String, () => console.log("value is a string")],
    [Number, () => console.log("value is a number")]
  )
  .orElse(() => console.log("no match"))
```

Patterns:

```js
import { match, pattern } from "patternmatcher"

const value = "Supercalifragilisticexpialidocious"

match(value).with(
  [pattern(/^[a-zA-Z]+$/), () => console.log("value is a string of letters")],
  [pattern(/^[0-9]+$/), () => console.log("value is a string of numbers")]
)
```
