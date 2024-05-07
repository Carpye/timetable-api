export type Filter = "teacher" | "class" | "classroom"

interface TimetableInfo {
  id: string
  shortname: string
}

interface ClassTimetableInfo extends TimetableInfo {
  group: "1/2" | "2/2" | null
}

interface Lesson {
  name: string
  class: ClassTimetableInfo
  teacher: TimetableInfo
  classroom: TimetableInfo
}

export interface Timetable {
  id: string
  name: string
  hours: string[]
  lessons: {
    poniedzialek: Lesson[]
    wtorek: Lesson[]
    sroda: Lesson[]
    czwartek: Lesson[]
    piatek: Lesson[]
  }
}
