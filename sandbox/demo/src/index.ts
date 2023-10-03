import { match } from "patternmatch-js"

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
  .with(
    [Student, () => console.log("is Student")],
    [Person, () => console.log("is person")]
  )
  .or(() => console.log("no match"))
  .catch((e) => console.log(e))
