import { ClassRef, PrimitiveConstructor } from "./types.js"

export {
  type,
  optional,
  nullable,
  Value,
  _,
  isObject,
  isConstructor,
  deepObjectEq,
  deepArrayEq,
}

class Value {
  static match<T>(lhs: any, val: T) {
    if (AnyValue.isAnyValue(lhs)) return true
    if (TypedValue.isTypedValue(lhs) && lhs.match(val)) return true
    if (OptionalValue.isOptionalValue(lhs) && lhs.match(val)) return true
    if (NullableValue.isNullableValue(lhs) && lhs.match(val)) return true

    return false
  }
}

class AnyValue {
  // @ts-expect-error
  private readonly __isAny = true
  static isAnyValue(val: any): val is AnyValue {
    return typeof val === "object" && "__isAny" in val
  }
}

const _ = new AnyValue()

class TypedValue<T> {
  private readonly classRefs: ClassRef<T>[]
  constructor(...classRefs: ClassRef<T>[]) {
    this.classRefs = classRefs
  }
  // @ts-expect-error
  private readonly __isOfType = true
  static isTypedValue(val: any): val is TypedValue<any> {
    return typeof val === "object" && "__isOfType" in val
  }

  match(val: any) {
    return matchTypes(val, this.classRefs)
  }
}

class OptionalValue<T> {
  private readonly classRefs: ClassRef<T>[]
  constructor(...classRefs: ClassRef<T>[]) {
    this.classRefs = classRefs
  }
  // @ts-expect-error
  private readonly __isOptional = true
  static isOptionalValue(val: any): val is OptionalValue<any> {
    return typeof val === "object" && "__isOptional" in val
  }
  match(val: any) {
    if (val === undefined) return true
    if (val === null) return false // null is not optional
    return matchTypes(val, this.classRefs)
  }
}

class NullableValue<T = void> {
  private readonly classRefs: ClassRef<T>[]
  constructor(...classRefs: ClassRef<T>[]) {
    this.classRefs = classRefs
  }
  // @ts-expect-error
  private readonly __isNullable = true
  static isNullableValue(val: any): val is NullableValue<any> {
    return typeof val === "object" && "__isNullable" in val
  }
  match(val: any) {
    if (val === null) return true
    if (val === undefined) return false // undefined is not nullable
    return matchTypes(val, this.classRefs)
  }
}

function optional<T>(...classRefs: ClassRef<T>[]) {
  return new OptionalValue(...classRefs)
}

function type<T>(...classRefs: ClassRef<T>[]) {
  return new TypedValue(...classRefs)
}

function nullable<T>(...classRefs: ClassRef<T>[]) {
  return new NullableValue(...classRefs)
}

function matchTypes<T>(val: any, classRefs: ClassRef<T>[]) {
  for (const classRef of classRefs) {
    if (matchType(val, classRef)) return true
  }
  return false
}

function matchType<T>(val: any, classRef: ClassRef<T> | PrimitiveConstructor) {
  switch (classRef) {
    case String:
      return typeof val === "string"
    case Number:
      return typeof val === "number"
    case Boolean:
      return typeof val === "boolean"
    case BigInt:
      return typeof val === "bigint"
    case Symbol:
      return typeof val === "symbol"
    case Array:
      return Array.isArray(val)
    case Object:
      return isObject(val)
    case Error:
      return val instanceof Error
    case Promise:
      return val instanceof Promise
    case Date:
      return val instanceof Date
    default:
      return val instanceof classRef
  }
}

function isConstructor(value: any): value is new (...args: any[]) => any {
  return (
    typeof value === "function" &&
    value.prototype &&
    value.prototype.constructor === value
  )
}

type Obj = Record<string | symbol | number, unknown>

function isObject(value: any): value is Obj {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Promise)
  )
}

function deepObjectEq(a: Obj, b: Obj) {
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()

  let optionalCount = 0

  for (let i = 0; i < aKeys.length; i++) {
    const aVal = a[aKeys[i]]
    const bVal = b[bKeys[i]]

    if (bKeys[i] === undefined) {
      if (OptionalValue.isOptionalValue(aVal)) {
        optionalCount++
      } else {
        return false
      }
    }

    if (Value.match(aVal, bVal)) continue
    if (isObject(aVal) && isObject(bVal) && deepObjectEq(aVal, bVal)) continue
    if (Array.isArray(aVal) && Array.isArray(bVal) && deepArrayEq(aVal, bVal))
      continue
    if (aVal !== bVal) return false
  }

  if (aKeys.length - optionalCount !== bKeys.length) {
    return false
  }

  return true
}

function deepArrayEq(a: Array<unknown>, b: Array<unknown>) {
  let optionalCount = 0

  for (let i = 0; i < a.length; i++) {
    const aVal = a[i]
    const bVal = b[i]

    if (Value.match(aVal, bVal)) {
      if (OptionalValue.isOptionalValue(aVal)) {
        optionalCount++
      }
      continue
    }
    if (isObject(aVal) && isObject(bVal) && deepObjectEq(aVal, bVal)) continue
    if (Array.isArray(aVal) && Array.isArray(bVal) && deepArrayEq(aVal, bVal))
      continue
    if (aVal !== bVal) return false
  }
  if (a.length - optionalCount !== b.length) {
    return false
  }
  return true
}
