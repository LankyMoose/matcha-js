import { isObject } from "./util.js"

export { pattern, any, AnyValue, _, DefaultValue }

type ConstructorType<T> = new (...args: any[]) => T

class AnyValue<T> {
  __isAny = true
  constructor(public match: { (val: any): val is T }) {}
  static isAnyValue(val: any): val is AnyValue<any> {
    return typeof val === "object" && val.__isAny
  }
}

class DefaultValue {
  __isDefault = true
  constructor() {}
  static isDefaultValue(val: any): val is DefaultValue {
    return typeof val === "object" && val.__isDefault
  }
}

const _ = () => new DefaultValue()

function pattern(regex: RegExp) {
  return new AnyValue(
    (val: any): val is string => typeof val === "string" && regex.test(val)
  )
}

type PrimitiveConstructor =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | ArrayConstructor
  | ObjectConstructor
  | ErrorConstructor
  | PromiseConstructor
  | DateConstructor

function any<T>(classRef: PrimitiveConstructor | ConstructorType<T>) {
  switch (classRef) {
    case String:
      return new AnyValue((val: any): val is string => typeof val === "string")
    case Number:
      return new AnyValue((val: any): val is number => typeof val === "number")
    case Boolean:
      return new AnyValue(
        (val: any): val is boolean => typeof val === "boolean"
      )
    case BigInt:
      return new AnyValue((val: any): val is bigint => typeof val === "bigint")
    case Symbol:
      return new AnyValue((val: any): val is symbol => typeof val === "symbol")
    case Array:
      return new AnyValue((val: any): val is any[] => Array.isArray(val))
    case Object:
      return new AnyValue((val: any): val is Object => isObject(val))
    case Error:
      return new AnyValue((val: any): val is Error => val instanceof Error)
    case Promise:
      return new AnyValue(
        (val: any): val is Promise<any> => val instanceof Promise
      )
    case Date:
      return new AnyValue((val: any): val is Date => val instanceof Date)
    default:
      return new AnyValue((val: any): val is T => val instanceof classRef)
  }
}
