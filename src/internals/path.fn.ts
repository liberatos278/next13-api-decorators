// Get the directory name of the current module to create URL path for controller
export function GetBasePath() {
  let errorStack = new Error().stack

  if (errorStack && process.platform === "win32") {
    errorStack = errorStack.replace(/\\/g, "/")
  }

  if (!errorStack) return ''

  const errorLine = errorStack
    .split("\n")
    .find((line) => line.includes("/app/"))

  if (!errorLine) return ''

  const fileInfo = errorLine
    .match(/\/app\/(.*?)(?=\/route\.ts)/)?.[0]
    .replace("/app", "")

  if (!fileInfo) return ''

  return fileInfo
}

// Format path to be used in routing and for path-to-regexp
export function FormatPath(path: string) {
  const pathParts = path.split("/")

  const newPathParts = pathParts.map((part) => {
    if (
      part.startsWith("[") &&
      part.endsWith("]") &&
      !part.startsWith("[...")
    ) {
      return `:${part.slice(1, -1)}`
    }

    if (part.startsWith("[...") && part.endsWith("]")) {
      return `:${part.slice(4, -1)}*`
    }

    return part
  })

  return newPathParts.join("/")
}
