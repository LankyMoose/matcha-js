import { isObject } from "./util.js"

export { type, optional, nullable, Value, _ }

type ClassRef<T> = PrimitiveConstructor | Constructor<T>

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
  // @ts-expect-error
  private readonly __isOfType = true
  classRefs: Array<ClassRef<T>>
  constructor(...classRefs: Array<ClassRef<T>>) {
    this.classRefs = classRefs
  }
  static isTypedValue(val: any): val is TypedValue<any> {
    return typeof val === "object" && "__isOfType" in val
  }

  match(val: any) {
    return matchTypes(val, ...this.classRefs)
  }
}

class OptionalValue<T = void> {
  // @ts-expect-error
  private readonly __isOptional = true
  classRefs: Array<ClassRef<T>>
  constructor(...classRefs: Array<ClassRef<T>>) {
    this.classRefs = classRefs
  }
  static isOptionalValue(val: any): val is OptionalValue<any> {
    return typeof val === "object" && "__isOptional" in val
  }
  match(val: any) {
    if (val === undefined) return true
    if (val === null) return false // null is not optional
    return matchTypes(val, ...this.classRefs)
  }
}

class NullableValue<T = void> {
  // @ts-expect-error
  private readonly __isNullable = true
  classRefs: Array<ClassRef<T>>
  constructor(...classRefs: Array<ClassRef<T>>) {
    this.classRefs = classRefs
  }
  static isNullableValue(val: any): val is NullableValue<any> {
    return typeof val === "object" && "__isNullable" in val
  }
  match(val: any) {
    if (val === null) return true
    if (val === undefined) return false // undefined is not nullable
    return matchTypes(val, ...this.classRefs)
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

function matchTypes<T>(
  val: any,
  ...classRefs: Array<PrimitiveConstructor | Constructor<T>>
) {
  return classRefs.some((classRef) => matchType(val, classRef))
}

function matchType<T>(val: any, classRef: ClassRef<T>) {
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
