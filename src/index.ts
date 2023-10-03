import { match } from "./match.js"

const myObject = { a: { b: 123 } }

class Person {
  constructor(public name: string) {}
}

class Student extends Person {
  constructor(public name: string, public grade: number) {
    super(name)
  }
}

const sam = new Student("sam", 1)

match(sam)
  .with([
    [Student, () => console.log("is Student")],
    [Person, () => console.log("is person")],
  ])
  .or(() => console.log("no match"))
  .catch((e) => console.log(e))

match({ a: 123 }).with([
  [{ a: 123 }, () => console.log("is object with a: 123")],
])
