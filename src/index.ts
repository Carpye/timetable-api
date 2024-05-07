import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { port } from "./config"

import idsRoutes from "./routes/ids"
import namesRoutes from "./routes/names"
import infoRoutes from "./routes/info"
import timetablesRouter from "./routes/timetables"

const app = new Elysia()

app
  .group("/api", (app) =>
    app.use(idsRoutes).use(namesRoutes).use(infoRoutes).use(timetablesRouter)
  )
  .use(swagger())
  .listen(port)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
