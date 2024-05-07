import { load } from "cheerio"
import { TIMETABLES_URL } from "../../config"
import { api } from "../../lib/api"
import { Filter } from "../../types"

export async function getNames(filter?: Filter) {
  const names = (await Bun.file("./src/parsed/info.json").json()) as {
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

async function scrapNames() {
  const ids = await Bun.file(
    "D:\\Projects\\elysia-timetable-scraper\\src\\parsed\\ids.json"
  ).json()

  console.log(ids)

  const names: { id: string; name: string }[] = []

  const file = Bun.file("./temp")

  const writer = file.writer()

  for (const id of ids) {
    const { data: html } = await api.get(`${TIMETABLES_URL}/${id}.html`)

    const $ = load(html)
    const name = $("span.tytulnapis").text()
    console.log(name)
    names.push({
      id,
      name,
    })
  }

  console.log(names)
}
