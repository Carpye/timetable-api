import { Patterns } from "@elysiajs/cron"
import { Config } from "./types"

const timetablesUrl = process.env.TIMETABLES_URL

if (!timetablesUrl) {
  throw new Error("TIMETABLES_URL is not defined in .env")
}

const defaultConfig: Config = {
  timetablesUrl,
  showApiCalls: false,
  scrapeOnStart: false,
  cron: {
    enabled: true,
    pattern: Patterns.everyMinutes(10), // Use Elysia Patterns or visit https://crontab.guru for easy pattern creation
  },
}

export default defaultConfig
