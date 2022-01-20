export const controller = new AbortController

export const request = <T>(url: string, controller: AbortController): Promise<T> => {
  return fetch(url, {signal: controller.signal}).then((response: Response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  }).catch((e: Error) => {
    throw e
  })
}
