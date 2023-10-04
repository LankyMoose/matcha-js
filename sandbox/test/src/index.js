import test from "node:test"
import assert from "node:assert"

import { match, any, _ } from "matcha-js"

test("primitive value", () => {
  const expected = 42
  const actual = match(42)([42, expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("class constructor", () => {
  const expected = 42
  const actual = match(42)([Number, expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("_", () => {
  const expected = 42
  const actual = match({})(["a random string", "hello world"], [_, expected])

  assert.strictEqual(actual, expected)
})

test("any(class)", () => {
  const expected = 42
  const actual = match(123)([any(Number), expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("regex", () => {
  const expected = 42
  const actual = match("hello world")([/hello/, expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("regex with flags", () => {
  const expected = 42
  const actual = match("hello world")([/HELLO/i, expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("empty array", () => {
  const expected = 42
  const actual = match([])([[], expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("array", () => {
  const expected = 42
  const actual = match([1, 2, 3])([[1, 2, 3], expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("array with any", () => {
  const expected = 42
  const actual = match([1, 2, 69])([[1, 2, any(Number)], expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("array with _", () => {
  const expected = 42
  const actual = match([1, 2, 69])([[1, 2, _], expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("complex array", () => {
  const expected = 42
  const actual = match([1, "", [3, 4, {}]])(
    [[_, any(String), [3, 4, {}]], expected],
    [_, "nope"]
  )

  assert.strictEqual(actual, expected)
})

test("empty object", () => {
  const expected = 42
  const actual = match({})([{}, expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("object", () => {
  const expected = 42
  const actual = match({ x: 1, y: 2 })([{ x: 1, y: 2 }, expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("object with any", () => {
  const expected = 42
  const actual = match({ x: 1, y: 69 })(
    [{ x: 1, y: any(Number) }, expected],
    [_, "nope"]
  )

  assert.strictEqual(actual, expected)
})

test("object with _", () => {
  const expected = 42
  const actual = match({ x: 1, y: 69 })([{ x: 1, y: _ }, expected], [_, "nope"])

  assert.strictEqual(actual, expected)
})

test("complex object", () => {
  const expected = 42
  const actual = match({ x: "", y: { z: 2 } })(
    [{ x: any(String), y: { z: _ } }, expected],
    [_, "nope"]
  )

  assert.strictEqual(actual, expected)
})
