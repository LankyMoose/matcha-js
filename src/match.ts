type Pattern = [any, () => any]

class PatternMatcher {
  matched = false
  error = null
  constructor(value: any, patterns: Pattern[]) {
    let match: Pattern | undefined

    for (const pattern of patterns) {
      const [lhs] = pattern
      switch (typeof value) {
        case "string":
          this.matched =
            lhs === String || (typeof lhs === "string" && lhs === value)
          break
        case "number":
          this.matched =
            lhs === Number || (typeof lhs === "number" && lhs === value)
          break
        case "boolean":
          this.matched =
            lhs === Boolean || (typeof lhs === "boolean" && lhs === value)
          break
        case "bigint":
          this.matched =
            lhs === BigInt || (typeof lhs === "bigint" && lhs === value)
          break
        case "symbol":
          this.matched =
            lhs === Symbol || (typeof lhs === "symbol" && lhs === value)
          break
        case "function":
          this.matched =
            lhs === Function || (typeof lhs === "function" && lhs === value)
          break
        default:
          break
      }

      if (this.matched) {
        match = pattern
        break
      }

      if (value instanceof Error) {
        this.matched = lhs === Error || (lhs instanceof Error && lhs === value)
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (value instanceof Promise) {
        this.matched =
          lhs === Promise || (lhs instanceof Promise && lhs === value)
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (value === null) {
        this.matched = lhs === null
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (value === undefined) {
        this.matched = lhs === undefined
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (Array.isArray(value)) {
        console.log("array", lhs, value)
        if (lhs === Array) {
          this.matched = true
        } else if (Array.isArray(lhs)) {
          this.matched =
            lhs.length === value.length &&
            lhs.every((p, i) => String(p) === String(value[i]))
        } else {
          continue
        }

        if (this.matched) {
          match = pattern
          break
        }
      }

      if (isObject(value)) {
        if (lhs === Object) {
          this.matched = true
        } else if (isObject(lhs)) {
          const aKeys = Object.keys(value)
          const bKeys = Object.keys(lhs)
          this.matched =
            aKeys.length === bKeys.length &&
            aKeys.every((p) => String(lhs[p]) === String(value[p]))
        } else {
          continue
        }

        if (this.matched) {
          match = pattern
          console.log("obj match", pattern, value)
          break
        }
      }
    }

    if (match) {
      try {
        match[1]()
      } catch (error: any) {
        this.error = error
      }
    }
  }

  or(fallback: () => any) {
    if (this.matched) return this
    fallback()
    return this
  }

  catch(fallback: (e: Error) => any) {
    if (this.error) fallback(this.error)
    return this
  }
}

function isObject(value: any) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Promise)
  )
}

export function match(x: any) {
  return {
    with: (patterns: Pattern[]) => new PatternMatcher(x, patterns),
  }
}
