import { load } from "cheerio"
import { TIMETABLES_URL } from "../../config"
import { api } from "../../lib/api"
import { Filter } from "../../types"

export async function getInfos(filter?: Filter) {
  const infos = (await Bun.file("./src/parsed/info.json").json()) as {
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

async function scrapNames() {
  const ids = await Bun.file(
    "D:\\Projects\\elysia-timetable-scraper\\src\\parsed\\ids.json"
  ).json()

  const names: { id: string; name: string }[] = []

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
