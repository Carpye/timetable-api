import Elysia from "elysia"
import { scrapeDate } from "../../scrapers/validDateScraper"

const validDateRoutes = new Elysia({ prefix: "/validDate" })
  .get("/", async () => {
    const result = await scrapeDate()
    return result
  })

export default validDateRoutes