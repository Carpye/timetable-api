import { load } from "cheerio"
import config from "../config"
import { api } from "../lib/api"
import chalk from "chalk"
import { scraperLog } from "../lib/console"
import axios from "axios"

export async function scrapeIds() {
  console.log(scraperLog, chalk.greenBright("Scraping ids..."))

  try {
    const response = await api.get(config.timetablesUrl)
    const html = response.data

    if (!html) {
      console.warn(
        scraperLog,
        chalk.yellow("Received empty response, skipping scraping")
      )
      return
    }

    const $ = load(html)

    const list = Object.values($("td a"))
      .map((element) => {
        const href = element?.attribs?.href
        if (!href || !href.endsWith(".html")) return null

        const name = $(`td a[href='${href}']`).text().replace(".html", "")
        return name
      })
      .filter(Boolean)

    await Bun.write("./src/parsed/ids.json", JSON.stringify(list, null, 2))

    console.log(
      scraperLog,
      chalk.greenBright("Scraped ids: ", chalk.yellowBright(list.length))
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        scraperLog,
        chalk.redBright(
          `[API ERROR] Request failed with status ${
            error.response?.status || "unknown"
          }`
        )
      )
    } else {
      console.error(
        scraperLog,
        chalk.redBright("Unexpected error in scrapeIds"),
        error
      )
    }

    console.warn(
      scraperLog,
      chalk.yellow("The scraper will try to run again if the cron job is set")
    )
  }

  return true
}
