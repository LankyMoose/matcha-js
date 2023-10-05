import type { MatchItem } from "./types.js"
import { omniMatch } from "./value.js"

export * from "./value.js"

export { match }

function matchSuccess<T>(item: MatchItem<T>, value: T) {
  return typeof item[1] === "function" ? item[1](value) : item[1]
}

function match<T>(value: T) {
  return <MI extends MatchItem<T>[]>(
    ...items: MI
  ): MI[number][1] extends Function ? ReturnType<MI[number][1]> : MI[number][1] => {
    for (const item of items) {
      if (omniMatch(value, item[0])) return matchSuccess(item, value)
    }
    throw new Error("No match found")
  }
}
