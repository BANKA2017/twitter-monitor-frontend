//export const controller = new AbortController
export class Controller {
  private controllerHandle: AbortController[];
  constructor() {
    this.controllerHandle = [new AbortController()]
  }
  get () {
    return this.controllerHandle[this.controllerHandle.length - 1]
  }
  public get length () {
    return this.controllerHandle.length
  }
  public get signal () {
    return this.controllerHandle[this.controllerHandle.length - 1].signal
  }
  public get afterAbortSignal () {
    return this.controllerHandle[this.controllerHandle.length - 2].signal
  }
  public abort () {
    this.controllerHandle[this.controllerHandle.length - 1].abort()
    this.controllerHandle.push(new AbortController())
  }
}
export const controller = new Controller()
export const request = <T>(url: string, controller?: Controller): Promise<T> => {
  if (!controller) {
    controller = new Controller()
  }
  controller.abort()
  return fetch(url, {signal: controller.signal}).then((response: Response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  }).catch((e: Error) => {
    throw e
  })
}
