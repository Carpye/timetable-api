import { Filter } from "../../types"

export async function getInfos(filter?: Filter) {
  const infos = (await Bun.file("./src/parsed/infos.json").json()) as {
    id: string
    name: string
  }[]

  if (!filter) {
    return infos
  }

  return infos.filter((name) => {
    switch (filter) {
      case "teacher":
        return name.id.startsWith("n")
      case "class":
        return name.id.startsWith("o")
      case "classroom":
        return name.id.startsWith("s")
    }
  })
}
