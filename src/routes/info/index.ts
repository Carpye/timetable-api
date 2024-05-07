import Elysia from "elysia"
import { Filter } from "../../types"
import { getInfo } from "./handlers"

const infoRoutes = new Elysia({ prefix: "/info" })
  .get("/", () => getInfo())
  .get("/:filter", ({ params, set }) => {
    const filter = params.filter

    if (filter && !["teacher", "class", "classroom"].includes(filter)) {
      set.status = 400
      return "Invalid filter. Available filters: teacher, class, classroom"
    }
    return getInfo(filter as Filter)
  })

export default infoRoutes
