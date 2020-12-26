export type PaginateData = { list: any[], page: number }

export default (listNames: string[] = []) => {
  return listNames.reduce((curr, listName) => {
    curr[listName] = {
      list: [],
      page: 0
    }
    return curr
  }, {} as Record<string, PaginateData>)
}
