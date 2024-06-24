import { load } from "cheerio"
import config from "../config"
import { api } from "../lib/api"
import chalk from "chalk"

export async function scrapeIds() {
  console.log(
    chalk.magentaBright("[SCRAPPER]"),
    chalk.greenBright("Scraping ids...")
  )

  const { data: html } = await api.get(config.timetablesUrl)

  const $ = load(html)

  const list = Object.values($("td a"))
    .map((element) => {
      const href = element?.attribs?.href

      if (!href || !href.endsWith(".html")) {
        return null
      }

      const name = $(`td a[href='${element?.attribs?.href}']`)
        .text()
        .replace(".html", "")

      return name
    })
    .filter(Boolean)

  Bun.write("./src/parsed/ids.json", JSON.stringify(list, null, 2))

  console.log(
    chalk.magentaBright("[SCRAPPER]"),
    chalk.greenBright("Scraped ids: ", chalk.yellowBright(list.length))
  )
}
