import { load } from "cheerio"
import config from "../config"
import { api } from "../lib/api"
import chalk from "chalk"

export async function scrapeInfos() {
  console.log(
    chalk.magentaBright("[SCRAPPER]"),
    chalk.greenBright("Scraping infos...")
  )

  const ids = await Bun.file(
    "D:\\Projects\\elysia-timetable-scraper\\src\\parsed\\ids.json"
  ).json()

  const infos: { id: string; name: string }[] = []

  for (const id of ids) {
    const { data: html } = await api.get(`${config.timetablesUrl}/${id}.html`)

    const $ = load(html)
    const name = $("span.tytulnapis").text()
    infos.push({
      id,
      name,
    })
  }

  Bun.write("./src/parsed/infos.json", JSON.stringify(infos, null, 2))

  console.log(
    chalk.magentaBright("[SCRAPPER]"),
    chalk.greenBright("Scraped infos: ", chalk.yellowBright(infos.length))
  )
}
