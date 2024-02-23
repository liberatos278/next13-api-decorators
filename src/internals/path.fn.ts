// Get the directory name of the current module to create URL path for controller
export function GetBasePath() {
  const dir = __dirname.split("/")
  const index = dir.indexOf("app")

  if (index === -1) throw new Error("No app directory found")
  return "/" + dir.slice(index + 1).join("/")
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
