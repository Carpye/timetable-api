import config from "../config"
import { scrapeIds } from "../scrapers/idsScraper"
import { scrapeInfos } from "../scrapers/infoScraper"
import { scrapeTimetables } from "../scrapers/timetablesScraper"

const args = process.argv.slice(2)

if (args.length === 0) {
  const scrapeScriptUsed = process.argv[1]?.includes("scrape")

  if (!scrapeScriptUsed) {
    if (config.scrapeOnStart) {
      scrape()
    }
  } else {
    scrape()
  }
} else {
  switch (args[0]) {
    case "ids":
      scrapeIds()
      break
    case "infos":
      scrapeInfos()
      break
    case "timetables":
      scrapeTimetables()
      break
    default:
      console.error(
        "Invalid scrape argument. Available: ids, infos, timetables"
      )
  }
}

export default async function scrape() {
  await scrapeIds()
  await scrapeInfos()
  await scrapeTimetables()
}
