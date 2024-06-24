import { Config } from "./types"
import defaultConfig from "./defaultConfig"

const config = {
  ...defaultConfig,
  showApiCalls: true,
  scrapeOnStart: false,
} satisfies Config

export default config
