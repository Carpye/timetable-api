import Elysia from "elysia"
import { getIds } from "./handlers"
import { Filter } from "../../types"

const idsRoutes = new Elysia({ prefix: "/ids" })
  .get("/", () => getIds())
  .get("/:filter", ({ params, set }) => {
    const filter = params.filter

    if (filter && !["teacher", "class", "classroom"].includes(filter)) {
      set.status = 400
      return "Invalid filter. Available filters: teacher, class, classroom"
    }
    return getIds(filter as Filter)
  })

export default idsRoutes
