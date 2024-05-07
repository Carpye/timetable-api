import Elysia from "elysia"
import { getNames } from "./handlers"
import { Filter } from "../../types"

const namesRoutes = new Elysia({ prefix: "/names" })
  .get("/", () => getNames())
  .get("/:filter", ({ params, set }) => {
    const filter = params.filter

    if (filter && !["teacher", "class", "classroom"].includes(filter)) {
      set.status = 400
      return "Invalid filter. Available filters: teacher, class, classroom"
    }
    return getNames(filter as Filter)
  })

export default namesRoutes
