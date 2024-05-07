import { load } from "cheerio"
import { TIMETABLES_URL } from "../config"
import { api } from "../lib/api"
import { getInfos } from "../routes/info/handlers"
import { getName } from "../routes/names/handlers"
import { Timetable } from "../types"

export async function scrapTimetables() {
  const infos = await getInfos()

  const timetables = []

  for (const info of infos) {
    const timetable = await scrapTimetable(info.id)
    timetables.push(timetable)
  }

  Bun.write("./src/parsed/timetables.json", JSON.stringify(timetables, null, 2))
}

export async function scrapTimetable(id = "o12") {
  if (id.match(/^[son]\d{1,3}/) === null) {
    throw new Error("Invalid id: " + id)
  }
  const { data: html } = await api.get(`${TIMETABLES_URL}/${id}.html`)
  const $ = load(html)

  const name = await getName(id)

  const timetable: Timetable = {
    id: "",
    name: "",
    hours: [],
    lessons: {
      poniedzialek: [],
      wtorek: [],
      sroda: [],
      czwartek: [],
      piatek: [],
    },
  }

  timetable.id = id

  timetable.name = name

  $("table.tabela td.g").each((_, el) => {
    const hour = $(el /*el is the same as (this) but (this) is not type-safe */)
      .text()
      .trim()

    timetable.hours.push(hour)
  })

  const filter = id.startsWith("o")
    ? "class"
    : id.startsWith("n")
    ? "teacher"
    : "classroom"

  console.log(
    $("table.tabela td.l")
      .map((i, el) => $(el).text())
      .get()
  )

  // @ts-ignore
  $("table.tabela td.l").each((i, el) => {
    const isEmpty = $(el).text() === "\u00a0"

    let classId = ""
    let className = ""
    let classGroup = null
    let classShortname = ""

    let teacherId = ""
    let teacherName = ""
    let teacherShortname = ""

    let classroomId = ""
    let classroomName = ""
    let classroomShortname = ""

    switch (filter) {
      case "class":
        classId = id
        className = name
        classShortname = name
        break
      case "teacher":
        teacherId = id
        teacherName = name
        teacherShortname = name
        break
      case "classroom":
        classroomId = id
        classroomName = name
        classroomShortname = name
        break
    }

    const subject = isEmpty ? "" : $(el).find(".p").text()

    const teacher = $(el).find(".n")
    if (teacher.length) {
      teacherId = teacher.attr("href")!.replace(".html", "")
      teacherShortname = teacher.text()
    }

    const classroom = $(el).find(".s")
    if (classroom.length) {
      classroomId = classroom.attr("href")!.replace(".html", "")
      classroomShortname = classroom.text()
    }

    const classInfo = $(el).find(".o")
    if (classInfo.length) {
      classId = classInfo.attr("href")!.replace(".html", "")
      classShortname = classInfo.text()
    }

    const lesson = {
      name: subject,
      class: {
        id: classId,
        group: classGroup,
        shortname: classShortname,
      },
      classroom: {
        id: classroomId,
        shortname: classroomShortname,
      },
      teacher: {
        id: teacherId,
        shortname: teacherShortname,
      },
    }

    switch (i % 5) {
      case 0:
        timetable.lessons.poniedzialek.push(lesson)
        break
      case 1:
        timetable.lessons.wtorek.push(lesson)
        break
      case 2:
        timetable.lessons.sroda.push(lesson)
        break
      case 3:
        timetable.lessons.czwartek.push(lesson)
        break
      case 4:
        timetable.lessons.piatek.push(lesson)
        break
    }
  })

  console.log(
    timetable.lessons.wtorek.map((lesson) => lesson.classroom.shortname)
  )

  return timetable
}
