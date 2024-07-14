import { Timetable } from "../../types"

export async function getTimetables() {
  const timetables = await Bun.file("./src/parsed/timetables.json").json()

  return timetables
}

export async function getTimetable(id: string) {
  const timetables: Timetable[] = await Bun.file(
    "./src/parsed/timetables.json"
  ).json()

  const timetable = timetables.find((timetable) => timetable.id === id)

  return timetable
}
