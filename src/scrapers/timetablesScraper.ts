import { load } from "cheerio"
import config from "../config"
import { api } from "../lib/api"
import { getInfos } from "../routes/info/handlers"
import { getName } from "../routes/names/handlers"
import { Lesson, Timetable } from "../types"
import chalk from "chalk"

/*
  ! DISCLAIMER !

  This code is awful and I'm sorry for that. I'm not proud of it but it works.
  Working with scraping vulcan-generated timetable is a nightmare.

*/

export async function scrapeTimetables() {
  const infos = await getInfos()

  const timetables = []

  const start = Date.now()

  console.log(
    chalk.magentaBright("[SCRAPPER]"),
    chalk.greenBright("Scraping timetables...")
  )

  for (const info of infos) {
    const timetable = await scrapTimetable(info.id)
    timetables.push(timetable)
  }

  const end = Date.now()

  console.log(
    chalk.magentaBright("[SCRAPPER]"),
    chalk.greenBright("Scrapped"),
    chalk.yellowBright(timetables.length),
    chalk.greenBright("timetables in"),
    chalk.yellowBright(`${(end / 1000 - start / 1000).toFixed(2)}s`),
    chalk.blueBright(`[${new Date().toLocaleTimeString()}]`)
  )

  Bun.write("./src/parsed/timetables.json", JSON.stringify(timetables))
}

export async function scrapTimetable(id = "o12") {
  if (id.match(/^[son]\d{1,3}/) === null) {
    throw new Error("Invalid id: " + id)
  }
  const { data: html } = await api.get(`${config.timetablesUrl}/${id}.html`)
  const $ = load(html)

  const name = await getName(id)

  const timetable: Timetable = {
    id: "",
    name: "",
    type: "",
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
  timetable.type = id.startsWith("o")
    ? "class"
    : id.startsWith("n")
    ? "teacher"
    : "classroom"
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

  $("table.tabela td.l").each((i, el) => {
    const isEmpty = $(el).text() === "\u00a0"

    const childs: any = []

    $(el)
      .children()
      .each((_, el) => {
        childs.push($(el).get(0)?.tagName)
      })

    const isDouble =
      childs[0] === "span" && childs[1] === "br" && childs[2] === "span"

    let classId = ""
    let className = ""
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

    let subject = isEmpty ? "" : $(el).find(" .p").text()

    const group = $(el).text().includes("1/2")
      ? "1/2"
      : $(el).text().includes("2/2")
      ? "2/2"
      : null

    if (group && !subject) subject = $(el).find("span > .p").text()

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

    let lesson: Lesson = {
      isDouble,
      isEmpty,
      classes: [
        {
          class: {
            id: classId,
            group: group,
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
          subject: {
            name: subject,
          },
        },
      ],
    }

    if (isDouble) {
      const [firstClass, secondClass] = $(el).find("> span")

      const firstClassEl = $(firstClass)
      const secondClassEl = $(secondClass)

      const firstClassName = firstClassEl.find("span.o").text()
      const firstClassId = ""

      const firstTeacher = firstClassEl.find("a.n").text()
      const firstTeacherId = firstClassEl
        .find("a.n")
        .attr("href")!
        .replace(".html", "")

      const firstClassroom = firstClassEl.find("a.s").text()
      const firstClassroomId = firstClassEl
        .find("a.s")
        .attr("href")!
        .replace(".html", "")

      const firstSubject = firstClassEl.find("span.p").text()

      const secondClassName = secondClassEl.find("span.o").text()
      const secondClassId = ""

      const secondTeacher = secondClassEl.find("a.n").text()

      const secondTeacherId = secondClassEl
        .find("a.n")
        .attr("href")!
        .replace(".html", "")

      const secondClassroom = secondClassEl.find("a.s").text()
      const secondClassroomId = secondClassEl
        .find("a.s")
        .attr("href")!
        .replace(".html", "")

      const secondSubject = secondClassEl.find("span.p").text()

      lesson.classes = [
        {
          class: {
            id: firstClassId,
            group: "1/2",
            shortname: firstClassName,
          },
          classroom: {
            id: firstClassroomId,
            shortname: firstClassroom,
          },
          teacher: {
            id: firstTeacherId,
            shortname: firstTeacher,
          },
          subject: {
            name: firstSubject,
          },
        },
        {
          class: {
            id: secondClassId,
            group: "2/2",
            shortname: secondClassName,
          },
          classroom: {
            id: secondClassroomId,
            shortname: secondClassroom,
          },
          teacher: {
            id: secondTeacherId,
            shortname: secondTeacher,
          },
          subject: {
            name: secondSubject,
          },
        },
      ]
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

  return timetable
}
