export const getAbsoluteFilePath = (path: string) =>
  `${Bun.main.slice(
    0,
    Bun.main.indexOf("elysia-timetable-scraper") +
      "elysia-timetable-scraper".length
  )}${path}`
