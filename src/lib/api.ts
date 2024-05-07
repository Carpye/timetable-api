import axios from "axios"
import { login, password } from "../config"
import chalk from "chalk"

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Basic " + Buffer.from(`${login}:${password}`).toString("base64"),
  },
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
  console.log(
    chalk.cyanBright("[AXIOS]"),
    chalk.greenBright("Request:"),
    chalk.blueBright(response.config.url),
    "-",
    chalk.yellowBright(`${milliseconds}ms`)
  )
  return response
})
