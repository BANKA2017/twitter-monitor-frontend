import {ElNotification} from "element-plus";

const ScrollTo = (top: number = 0): void => {
  window.scrollTo({
    top: top,
    behavior: "smooth"
  });
};

const Notice = (text: string = "", status: 'success' | 'warning' | 'info' | 'error' | undefined = 'success', duration: number = 1500, useHTML: boolean = false) => {
  ElNotification({
    message: text,
    type: status,
    dangerouslyUseHTMLString: useHTML,
    duration
  });
}

const createRealMediaPath = (realMediaPath: string, samePath: boolean = false, type: string = 'tweets'): string => realMediaPath + (samePath ? type + '/' : '')

const NullSafeParams = <T>(content: T | undefined, defaultValue: T): T => {
  if (typeof content !== 'undefined') {
    return content
  } else {
    return defaultValue
  }
}

const Equal = (to: boolean): '0' | '1' => to ? '1' : '0'

export {ScrollTo, Notice, createRealMediaPath, NullSafeParams, Equal}
