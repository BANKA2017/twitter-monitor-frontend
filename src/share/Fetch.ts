export class Controller {
  private readonly controllerHandle: AbortController[];
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
export const request = <T>(url: string, controller?: Controller, method: 'POST' | 'GET' | 'DELETE' | 'PUT' = 'GET', body: any = ''): Promise<T> => {
  if (!controller) {
    controller = new Controller()
  }
  controller.abort()
  const tmpBaseBodyType = typeof body
  let options: {
    method: 'POST' | 'GET' | 'DELETE' | 'PUT';
    signal: AbortController["signal"];
    headers: { [p in string]: string};
    body ?: string
  } = {
    method,
    signal: controller?.signal,
    headers: {
      'Content-Type': tmpBaseBodyType === 'string' ? 'application/x-www-form-urlencoded' : 'application/json'
    }
  }
  if (method === 'POST') {
    options['body'] = ((tmpBaseBodyType === 'object' ? JSON.stringify(body) : body.toString()))
  }
  return fetch(url, options).then((response: Response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  }).catch((e: Error) => {
    throw e
  })
}
