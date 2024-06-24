import { Filter } from "../../types"

export async function getNames(filter?: Filter) {
  const names = (await Bun.file("./src/parsed/infos.json").json()) as {
    id: string
    name: string
  }[]

  if (!filter) {
    return names.map((info) => info.name)
  }

  return names
    .filter((info) => {
      switch (filter) {
        case "teacher":
          return info.id.startsWith("n")
        case "class":
          return info.id.startsWith("o")
        case "classroom":
          return info.id.startsWith("s")
      }
    })
    .map((info) => info.name)
}

export async function getName(id: string) {
  const names = (await Bun.file("./src/parsed/infos.json").json()) as {
    id: string
    name: string
  }[]

  return names.find((info) => info.id === id)!.name
}
