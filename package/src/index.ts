import { isObject, isConstructor } from "./util.js"
import { AnyValue, DefaultValue } from "./value.js"

export * from "./value.js"

export { match }

type Pattern<T> = [any, ((val: T) => any) | any]

function matchSuccess<T>(pattern: Pattern<T>, value: T) {
  return typeof pattern[1] === "function" ? pattern[1](value) : pattern[1]
}

function match<T>(value: T) {
  return <P extends Pattern<T>[]>(
    ...patterns: P
  ): P[number][1] extends Function
    ? ReturnType<P[number][1]>
    : P[number][1] => {
    for (const pattern of patterns) {
      const [lhs] = pattern

      switch (typeof value) {
        case "string":
          if (
            lhs === String ||
            (typeof lhs === "string" && lhs === value) ||
            (lhs instanceof RegExp && lhs.test(value))
          )
            return matchSuccess(pattern, value)
          break
        case "number":
          if (lhs === Number || (typeof lhs === "number" && lhs === value))
            return matchSuccess(pattern, value)
          break
        case "boolean":
          if (lhs === Boolean || (typeof lhs === "boolean" && lhs === value))
            return matchSuccess(pattern, value)
          break
        case "bigint":
          if (lhs === BigInt || (typeof lhs === "bigint" && lhs === value))
            return matchSuccess(pattern, value)
          break
        case "symbol":
          if (lhs === Symbol || (typeof lhs === "symbol" && lhs === value))
            return matchSuccess(pattern, value)
          break
        case "function":
          if (lhs === Function || (typeof lhs === "function" && lhs === value))
            return matchSuccess(pattern, value)
          break
        default:
          break
      }

      if (AnyValue.isAnyValue(lhs)) {
        if (lhs.match(value)) return matchSuccess(pattern, value)
      } else if (DefaultValue.isDefaultValue(lhs)) {
        return matchSuccess(pattern, value)
      }

      for (const classRef of [Error, Promise, Date]) {
        if (value instanceof classRef) {
          if (lhs === classRef || lhs === value.constructor)
            return matchSuccess(pattern, value)
        }
      }

      if (value === null || value === undefined) {
        if (lhs === value) return matchSuccess(pattern, value)
      }

      if (Array.isArray(value)) {
        if (lhs === Array) {
          return pattern[1]()
        } else if (Array.isArray(lhs)) {
          if (
            lhs.length === value.length &&
            lhs.every(
              (p, i) =>
                p === value[i] || (p instanceof AnyValue && p.match(value[i]))
            )
          ) {
            return matchSuccess(pattern, value)
          }
        } else {
          continue
        }
      }

      if (isObject(value)) {
        if (isConstructor(lhs)) {
          if (value instanceof lhs) return matchSuccess(pattern, value)
        }
        if (lhs === Object) {
          return pattern[1]()
        } else if (isObject(lhs)) {
          const aKeys = Object.keys(value)
          const bKeys = Object.keys(lhs)
          if (
            aKeys.length === bKeys.length &&
            aKeys.every(
              (p) =>
                lhs[p] === value[p as keyof typeof value] ||
                (lhs[p] instanceof AnyValue &&
                  lhs[p].match(value[p as keyof typeof value]))
            )
          ) {
            return matchSuccess(pattern, value)
          }
        } else {
          continue
        }
      }
    }
    throw new Error("No match found")
  }
}
