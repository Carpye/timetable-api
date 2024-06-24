import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { CronConfig, Patterns, cron } from "@elysiajs/cron"

import config from "./config"
import idsRoutes from "./routes/ids"
import namesRoutes from "./routes/names"
import infoRoutes from "./routes/info"
import timetablesRouter from "./routes/timetables"
import { scrapeTimetables } from "./scrapers/timetablesScraper"
import chalk from "chalk"
import scrape from "./scripts/scrape"

const app = new Elysia()

app.get("/", ({ headers, set }) => {
  set.headers = {
    "Content-Type": "text/html; charset=utf-8",
  }

  return `Visit <a href="http://${headers.host}/swagger">swagger page</a> for routes info.`
})

app
  .group("/api", (app) =>
    app.use(idsRoutes).use(namesRoutes).use(infoRoutes).use(timetablesRouter)
  )
  .use(swagger())
  .listen(process.env.PORT ?? 8080)

if (!process.env.PORT)
  console.log(
    chalk.yellowBright("[WARNING]"),
    "PORT not set. Using default 8080"
  )

console.log(
  `✨ Timetable API is running at http://${app.server?.hostname}:${app.server?.port} ✨`
)

// --- CRON JOBS ---

const cronJob: CronConfig = {
  name: "scrapte",
  pattern: config.cron.pattern ?? Patterns.EVERY_10_MINUTES,
  run: async function () {
    console.log(
      chalk.yellowBright("[CRON]"),
      chalk.greenBright(`Running job: ${cronJob.name} at`),
      chalk.blue(`[${new Date().toLocaleTimeString()}]`)
    )

    await scrape()
  },
}

if (config.cron.enabled) app.use(cron(cronJob))
