import { ClassRef, Constructor, MatchResult, Obj, Resolved } from "./types.js"

export {
  type,
  optional,
  nullable,
  Value,
  AnyValue,
  NullableValue,
  OptionalValue,
  TypedValue,
  _,
  omniMatch,
  anySymbol,
}

class Value {
  #_isSpread: boolean = false
  get isSpread(): boolean {
    return this.#_isSpread
  }

  static isValue(val: any): val is Value {
    if (typeof val !== "object") return false
    return (
      AnyValue.isAnyValue(val) ||
      TypedValue.isTypedValue(val) ||
      OptionalValue.isOptionalValue(val) ||
      NullableValue.isNullableValue(val)
    )
  }

  static match<V extends Value>(value: V, val: unknown): MatchResult<V> | void {
    if (AnyValue.isAnyValue(value)) return { value } as MatchResult<V>
    if (
      TypedValue.isTypedValue(value) ||
      OptionalValue.isOptionalValue(value) ||
      NullableValue.isNullableValue(value)
    )
      return value.match(val) as MatchResult<V>
  }

  [Symbol.iterator](): Iterator<this> {
    let i = 0
    return {
      next: () => {
        if (i === 0) {
          i++
          this.#_isSpread = true
          return { value: this, done: false }
        }
        return { value: undefined, done: true }
      },
    }
  }
}

const anySymbol = Symbol("matcha_any")

class AnyValue extends Value {
  // @ts-expect-error
  private readonly [anySymbol] = true

  get [Symbol.toStringTag]() {
    return "MatchaAny"
  }
  static isAnyValue(val: any): val is AnyValue {
    return val.toString() === "[object MatchaAny]"
  }
  static isPartialObject(val: Obj): boolean {
    // check if the object has the anySymbol property
    return anySymbol in val
  }
}

const _ = new AnyValue()

class TypedValue<T extends ClassRef<unknown>> extends Value {
  constructor(private classRef: T) {
    super()
  }
  get [Symbol.toStringTag]() {
    return "MatchaTyped"
  }
  static isTypedValue(val: any): val is TypedValue<ClassRef<unknown>> {
    return val.toString() === "[object MatchaTyped]"
  }

  match(val: unknown): MatchResult<this> | void {
    return matchType(val, this.classRef) as MatchResult<this>
  }
}

class OptionalValue<T extends ClassRef<unknown>> extends Value {
  constructor(private classRef: T) {
    super()
  }
  get [Symbol.toStringTag]() {
    return "MatchaOptional"
  }
  static isOptionalValue(val: any): val is OptionalValue<ClassRef<unknown>> {
    return val.toString() === "[object MatchaOptional]"
  }
  match(value: unknown): MatchResult<this> | void {
    if (value === undefined) return { value } as MatchResult<this>
    if (value === null) return // null is not optional
    return matchType(value, this.classRef) as MatchResult<this>
  }
}

class NullableValue<T extends ClassRef<unknown>> extends Value {
  constructor(private classRef: T) {
    super()
  }
  get [Symbol.toStringTag]() {
    return "MatchaNullable"
  }
  static isNullableValue(val: any): val is NullableValue<ClassRef<unknown>> {
    return val.toString() === "[object MatchaNullable]"
  }
  match(value: unknown): MatchResult<this> | void {
    if (value === null) return { value } as MatchResult<this>
    if (value === undefined) return // undefined is not nullable
    return matchType(value, this.classRef) as MatchResult<this>
  }
}

function optional<T extends ClassRef<unknown>>(classRef: T) {
  return new OptionalValue(classRef)
}

function type<T extends ClassRef<unknown>>(classRef: T) {
  return new TypedValue(classRef)
}

function nullable<T extends ClassRef<unknown>>(classRef: T) {
  return new NullableValue(classRef)
}

function matchType<T>(value: T, classRef: ClassRef<unknown>): MatchResult<T> | void {
  switch (classRef) {
    case String:
      if (typeof value === "string") return { value } as MatchResult<T>
      break
    case Number:
      if (typeof value === "number") return { value } as MatchResult<T>
      break
    case Boolean:
      if (typeof value === "boolean") return { value } as MatchResult<T>
      break
    case BigInt:
      if (typeof value === "bigint") return { value } as MatchResult<T>
      break
    case Symbol:
      if (typeof value === "symbol") return { value } as MatchResult<T>
      break
    case Array:
      if (Array.isArray(value)) return { value } as MatchResult<T>
      break
    case Object:
      if (isObject(value)) return { value } as MatchResult<T>
      break
    case Error:
      if (value instanceof Error) return { value } as MatchResult<T>
      break
    case Promise:
      if (value instanceof Promise) return { value } as MatchResult<T>
      break
    case Date:
      if (value instanceof Date) return { value } as MatchResult<T>
      break
    default:
      if (value instanceof classRef) return { value } as MatchResult<T>
  }
}

function isConstructor(value: any): value is Constructor<unknown> {
  return (
    typeof value === "function" &&
    value.prototype &&
    value.prototype.constructor === value
  )
}

function isObject(value: any): value is Obj {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Promise)
  )
}

function deepObjectEq<T extends Obj>(value: Obj, pattern: T): MatchResult<T> | void {
  const isPartial = AnyValue.isPartialObject(pattern)

  const pKeys = Object.keys(pattern).sort()

  if (isPartial) {
    for (let i = 0; i < pKeys.length; i++) {
      const pKey = pKeys[i]

      const pVal = pattern[pKey]
      const vVal = value[pKey]

      if (pVal === undefined) {
        if (isPartial) continue
        return
      }

      if (pVal === null) {
        if (vVal !== null) return
        continue
      }

      if (Value.isValue(pVal)) {
        if (!Value.match(pVal, vVal)) return
        continue
      }

      if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(vVal, pVal)) {
        continue
      }

      if (isObject(pVal) && isObject(vVal) && deepObjectEq(vVal, pVal)) {
        continue
      }

      if (pVal !== vVal) return
    }
  } else {
    const vKeys = Object.keys(value).sort()

    for (let i = 0; i < vKeys.length; i++) {
      const vKey = vKeys[i]

      const pVal = pattern[vKey]
      const vVal = value[vKey]

      if (pVal === undefined) {
        if (isPartial) continue
        return
      }

      if (pVal === null) {
        if (vVal !== null) return
        continue
      }

      if (Value.isValue(pVal)) {
        if (!Value.match(pVal, vVal)) return
        continue
      }

      if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(vVal, pVal)) {
        continue
      }

      if (isObject(pVal) && isObject(vVal) && deepObjectEq(vVal, pVal)) {
        continue
      }

      if (pVal !== vVal) return
    }

    const pOnlyKeys = pKeys.filter((key) => !vKeys.includes(key))

    if (pOnlyKeys.length > 0) {
      for (let i = 0; i < pOnlyKeys.length; i++) {
        const pVal = pattern[pOnlyKeys[i]]

        if (pVal === undefined || pVal === null) return

        if (OptionalValue.isOptionalValue(pVal)) continue

        return
      }
    }
  }

  return { value } as MatchResult<T>
}

function deepArrayEq<T extends Array<unknown>>(
  value: Array<unknown>,
  pattern: T
): MatchResult<T> | void {
  let pi = 0
  let vi = 0

  while (pi < pattern.length || vi < value.length) {
    const pItem = pattern[pi]
    const vItem = value[vi]

    if (Value.isValue(pItem)) {
      const nextPatternItem = pattern[pi + 1]
      if (Value.match(pItem, vItem)) {
        if (pItem.isSpread) {
          vi++

          // if the next pattern item is not a spread and would match with this value item
          // then we need to end this spread
          //eg:
          // val = ["start", "started", "going", "ending", "ended"]
          // pattern = ["start", ...type(String), "going", ...type(String)]

          if (Value.isValue(nextPatternItem) && nextPatternItem.isSpread) {
          } else {
            if (omniMatch(vItem, nextPatternItem)) {
              pi++
              vi--
            }
          }

          continue
        }
        pi++
        vi++
        continue
      }

      if (!omniMatch(vItem, nextPatternItem)) {
        return
      }

      pi++
      if (pi > value.length) return
      if (pi > pattern.length) return
      continue
    }

    if (isObject(pItem) && isObject(vItem)) {
      if (!deepObjectEq(vItem, pItem)) return
      pi++
      vi++
      continue
    }

    if (Array.isArray(pItem) && Array.isArray(vItem)) {
      if (!deepArrayEq(vItem, pItem)) return
      pi++
      vi++
      continue
    }

    if (pItem === vItem) {
      pi++
      vi++
      continue
    } else {
      if (!pItem) return
      // handle cases where:
      // value = ["start", "middle", "end", "the very end"]
      // pattern = [...type(String), "end", "the very end"]
      // or:
      // value = ["start", "middle", "end", "the very end", "just kidding"]
      // pattern = ["start", ...type(String), "end", "the very end"]

      const pItemDistToEnd = pattern.length - pi
      let vIdx = value.length - pItemDistToEnd

      const vItem = value[vIdx]

      if (vItem === pItem) {
        pi++
        vi++
        continue
      }

      if (primitiveMatch(vItem, pItem)) {
        pi++
        vi++
        continue
      }

      if (Array.isArray(pItem) && Array.isArray(vItem)) {
        if (!deepArrayEq(vItem, pItem)) return
        pi++
        vi++
        continue
      }

      if (Value.isValue(pItem) && Value.match(pItem, vItem)) {
        pi++
        vi++
        continue
      }

      if (isObject(pItem) && isObject(vItem)) {
        if (!deepObjectEq(vItem, pItem)) return
        pi++
        vi++
        continue
      }

      return
    }
  }

  return { value } as MatchResult<T>
}

function primitiveMatch<T>(value: unknown, pattern: T): MatchResult<T> | void {
  switch (typeof value) {
    case "string":
      if (pattern === String || (typeof pattern === "string" && pattern === value))
        return { value } as MatchResult<T>
      if (pattern instanceof RegExp) {
        const match = pattern.exec(value)
        if (match) return { value: match as Resolved<T> }
      }
      break
    case "number":
      if (pattern === Number || (typeof pattern === "number" && pattern === value))
        return { value } as MatchResult<T>
      break
    case "boolean":
      if (pattern === Boolean || (typeof pattern === "boolean" && pattern === value))
        return { value } as MatchResult<T>
      break
    case "bigint":
      if (pattern === BigInt || (typeof pattern === "bigint" && pattern === value))
        return { value } as MatchResult<T>
      break
    case "symbol":
      if (pattern === Symbol || (typeof pattern === "symbol" && pattern === value))
        return { value } as MatchResult<T>
      break
    case "function":
      if (pattern === Function || (typeof pattern === "function" && pattern === value))
        return { value } as MatchResult<T>
      break
    default:
      break
  }
}

function arrayMatch<T>(value: unknown, pattern: T): MatchResult<T> | void {
  if (!Array.isArray(value)) return

  if (pattern === Array) return { value } as MatchResult<T>

  if (Array.isArray(pattern)) return deepArrayEq(value, pattern)
}

function objectMatch<T>(value: unknown, pattern: T): MatchResult<T> | void {
  if (!isObject(value)) return

  if (pattern === Object) return { value } as MatchResult<T>

  if (isConstructor(pattern) && value instanceof pattern)
    return { value } as MatchResult<T>

  if (isObject(pattern)) return deepObjectEq(value, pattern)
}

function valueMatch<T>(value: unknown, pattern: T): MatchResult<T> | void {
  if (Value.isValue(pattern)) return Value.match(pattern, value)
}

function omniMatch<T>(value: unknown, pattern: T): MatchResult<T> | void {
  return value === pattern
    ? ({ value } as MatchResult<T>)
    : primitiveMatch(value, pattern) ||
        arrayMatch(value, pattern) ||
        valueMatch(value, pattern) ||
        objectMatch(value, pattern)
}
