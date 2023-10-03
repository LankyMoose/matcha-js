type Pattern = [any, () => any]

class PatternMatcher {
  matched = false
  error = null
  constructor(x: any, patterns: Pattern[]) {
    let match: Pattern | undefined

    for (const pattern of patterns) {
      if (typeof x === "string") {
        this.matched =
          pattern[0] === String ||
          (typeof pattern[0] === "string" && pattern[0] === x)
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (typeof x === "number") {
        this.matched =
          pattern[0] === Number ||
          (typeof pattern[0] === "number" && pattern[0] === x)

        if (this.matched) {
          match = pattern
          break
        }
      }

      if (typeof x === "boolean") {
        this.matched =
          pattern[0] === Boolean ||
          (typeof pattern[0] === "boolean" && pattern[0] === x)

        if (this.matched) {
          match = pattern
          break
        }
      }

      if (typeof x === "bigint") {
        this.matched =
          pattern[0] === BigInt ||
          (typeof pattern[0] === "bigint" && pattern[0] === x)

        if (this.matched) {
          match = pattern
          break
        }
      }

      if (typeof x === "symbol") {
        this.matched =
          pattern[0] === Symbol ||
          (typeof pattern[0] === "symbol" && pattern[0] === x)

        if (this.matched) {
          match = pattern
          break
        }
      }

      if (typeof x === "function") {
        this.matched =
          pattern[0] === Function ||
          (typeof pattern[0] === "function" && pattern[0] === x)

        if (this.matched) {
          match = pattern
          break
        }
      }

      if (x instanceof Date) {
        this.matched =
          pattern[0] === Date ||
          (pattern[0] instanceof Date && pattern[0] === x)
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (x instanceof RegExp) {
        this.matched =
          pattern[0] === RegExp ||
          (pattern[0] instanceof RegExp && pattern[0] === x)
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (x instanceof Error) {
        this.matched =
          pattern[0] === Error ||
          (pattern[0] instanceof Error && pattern[0] === x)
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (x instanceof Promise) {
        this.matched =
          pattern[0] === Promise ||
          (pattern[0] instanceof Promise && pattern[0] === x)
        if (this.matched) {
          match = pattern
          break
        }
      }

      if (x === null) {
        this.matched = pattern[0] === null
        if (this.matched) match = pattern
        break
      }

      if (x === undefined) {
        this.matched = pattern[0] === undefined
        if (this.matched) match = pattern
        break
      }

      if (Array.isArray(x)) {
        if (!Array.isArray(pattern[0])) break
        if (x.length === 0) {
          this.matched = pattern[0].length === 0
        } else if (x.length !== pattern[0].length) {
          this.matched = false
        } else {
          this.matched = pattern[0].every((p, i) => p === x[i])
        }

        if (this.matched) {
          match = pattern
          break
        } else {
          continue
        }
      }

      if (typeof x === "object") {
        if (typeof pattern[0] !== "object") break
        if (Object.keys(x).length === 0) {
          this.matched = Object.keys(pattern[0]).length === 0
        } else if (Object.keys(x).length !== Object.keys(pattern[0]).length) {
          this.matched = false
        } else {
          this.matched = Object.keys(pattern[0]).every(
            (p) => pattern[0][p] === x[p]
          )
        }
        if (this.matched) {
          match = pattern
          break
        } else {
          continue
        }
      }

      this.matched = pattern[0] === x
      if (this.matched) {
        match = pattern
        break
      }
    }

    if (match) {
      try {
        match[1]()
        this.matched = true
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

export function match(x: any) {
  return {
    with: (patterns: Pattern[]) => new PatternMatcher(x, patterns),
  }
}
