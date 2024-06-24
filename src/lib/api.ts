import axios, { AxiosDefaults, CreateAxiosDefaults } from "axios"
import config from "../config"
import chalk from "chalk"

const headers: { [key: string]: any } = {
  "Content-Type": "application/json",
}

if (process.env.LOGIN && process.env.PASSWORD) {
  headers["Authorization"] =
    "Basic " +
    Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`).toString(
      "base64"
    )
} else if (!process.env.LOGIN !== !process.env.PASSWORD) {
  throw new Error("LOGIN and PASSWORD must be both defined or undefined")
}

export const api = axios.create({
  baseURL: config.timetablesUrl,
  headers,
})

api.interceptors.request.use((config) => {
  config.headers["request-startTime"] = Date.now()
  return config
})

api.interceptors.response.use((response) => {
  const start = response.config.headers["request-startTime"]
  const end = Date.now()
  const milliseconds = end - start
  response.headers["request-duration"] = milliseconds
  if (config.showApiCalls)
    console.log(
      chalk.cyanBright("[API]"),
      chalk.greenBright("Request:"),
      chalk.blueBright(response.config.url),
      "-",
      chalk.yellowBright(`${milliseconds}ms`)
    )
  return response
})
