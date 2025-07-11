import { load } from "cheerio"
import chalk from "chalk"
import { getAbsoluteFilePath } from "../lib/utils"
import { api } from "../lib/api"
import config from "../config"
import { scraperLog } from "../lib/console"

export async function scrapeDate() {
  console.log(scraperLog, chalk.greenBright("Scraping date..."))

  try {
    const { data: html } = await api.get(`${config.timetablesUrl}/s1.html`)
    const $ = load(html)
    const dateText = $("td:contains('Obowiązuje od:')").text()
    
    const dateMatch = dateText.match(
      /Obowiązuje od: (\d{1,2}\.\d{1,2}\.\d{4})/
    )

    if (dateMatch) {
      const date = { date: dateMatch[1] }
      const filePath = getAbsoluteFilePath("./src/parsed/date.json")
      await Bun.write(filePath, JSON.stringify(date, null, 2))

      console.log(
        scraperLog,
        chalk.greenBright("Scraped date: ", chalk.yellowBright(date.date))
      )

      return date
    } else {
      console.log(scraperLog, chalk.redBright("Date not found"))
      return { error: "Date not found" }
    }
  } catch (error) {
    console.log(
      scraperLog,
      chalk.redBright("Error fetching the plan: ", (error as any).message)
    )
    return { error: "Error fetching the plan" }
  }
}
