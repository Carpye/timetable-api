export interface Config {
  timetablesUrl: string
  showApiCalls: boolean
  scrapeOnStart: boolean
  cron: {
    enabled: boolean
    pattern?: string
  }
}

export type Filter = "teacher" | "class" | "classroom"

interface TimetableInfo {
  id: string
  shortname: string
}

interface ClassTimetableInfo extends TimetableInfo {
  group: "1/2" | "2/2" | null
}

interface SubjectInfo {
  name: string
}

export interface Lesson {
  isDouble: boolean
  isEmpty: boolean
  classes: {
    class: ClassTimetableInfo
    teacher: TimetableInfo
    classroom: TimetableInfo
    subject: SubjectInfo
  }[]
}

export interface Timetable {
  id: string
  name: string
  type: string
  hours: string[]
  lessons: {
    poniedzialek: Lesson[]
    wtorek: Lesson[]
    sroda: Lesson[]
    czwartek: Lesson[]
    piatek: Lesson[]
  }
}
