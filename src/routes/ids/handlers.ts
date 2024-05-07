import { load } from "cheerio"
import { TIMETABLES_URL } from "../../config"
import { api } from "../../lib/api"

export async function getIds(filter?: "teacher" | "class" | "classroom") {
  const { data: html } = await api.get(TIMETABLES_URL)

  const $ = load(html)

  const list = Object.values($("td a"))
    .map((element) => {
      const href = element?.attribs?.href

      if (!href || !href.endsWith(".html")) {
        return null
      }

      const name = $(`td a[href='${element?.attribs?.href}']`)
        .text()
        .replace(".html", "")

      if (filter) {
        switch (filter) {
          case "teacher":
            return name.startsWith("n") ? name : null
          case "class":
            return name.startsWith("o") ? name : null
          case "classroom":
            return name.startsWith("s") ? name : null
        }
      } else {
        return name
      }
    })
    .filter(Boolean)

  return list
}
