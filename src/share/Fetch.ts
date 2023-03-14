export class Controller {
  private readonly controllerHandle: AbortController[]
  private requestStatus: boolean
  constructor() {
    this.controllerHandle = [new AbortController()]
    this.requestStatus = false
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
  public get status () {
    return this.requestStatus
  }
  public abort () {
    if (this.requestStatus) {
      this.controllerHandle[this.controllerHandle.length - 1].abort()
    }
    this.controllerHandle.push(new AbortController())
  }
  public switchStatus (value: boolean | null = null) {
    if (value === null) {
      this.requestStatus = !this.requestStatus
    } else {
      this.requestStatus = value
    }
  }
}
export const controller = new Controller()
export const request = async <T>(url: string, controller?: Controller, method: 'POST' | 'GET' | 'DELETE' | 'PUT' = 'GET', body: any = ''): Promise<T> => {
  if (!controller) {
    controller = new Controller()
  }
  controller.abort()
  controller.switchStatus(true)
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
  try {
    const response = await fetch(url, options)
    controller?.switchStatus(false)
    if (!response.ok) {
      throw new Error(JSON.stringify(response.json()))
    }
    return await response.json()
  } catch (e) {
    throw e
  }
}
