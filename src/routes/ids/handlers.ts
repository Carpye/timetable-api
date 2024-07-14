export async function getIds(filter?: "teacher" | "class" | "classroom") {
  const ids = (await Bun.file("./src/parsed/ids.json").json()) as string[]

  if (!filter) {
    return ids
  }

  return ids
    .map((id) => {
      switch (filter) {
        case "teacher":
          return id.startsWith("n") ? id : null
        case "class":
          return id.startsWith("o") ? id : null
        case "classroom":
          return id.startsWith("s") ? id : null
      }
    })
    .filter(Boolean)
}
