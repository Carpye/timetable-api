import Elysia from "elysia"
import { getTimetable, getTimetables } from "./handlers"

const timetablesRouter = new Elysia({ prefix: "/timetables" })
  .get("/", () => {
    return getTimetables()
  })
  .get("/:id", ({ params, set }) => {
    const id = params.id

    if (id.match(/^[son]\d{1,3}/) === null) {
      set.status = 400
      return "Invalid id. Must match /^[son]\\d{1,3}/."
    }
    return getTimetable(id)
  })

export default timetablesRouter
