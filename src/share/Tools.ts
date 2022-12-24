import {ElNotification} from "element-plus";
import html2canvas from "html2canvas";

const ScrollTo = (top: number | Element | null = 0): void => {
  if (typeof top === 'number') {
    window.scrollTo({
      top,
      behavior: "smooth"
    })
  } else if (top !== null) {
    top.scrollIntoView({behavior: 'smooth'})
  }
}

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
const VerifyQueryString = <T>(value: T | null | undefined, defaultValue: T | number | bigint) => {
  if (!value || typeof value === 'object' || ((typeof defaultValue === 'number' || typeof defaultValue === 'bigint') && isNaN(Number(value)))) {
    return defaultValue
  }

  return value
}

const autoStopVideo = (handle: HTMLVideoElement) => {
  if (!handle) {
    return
  }
  (new IntersectionObserver((entries, observer) => {
    if (handle.buffered) {
      if (entries[0].intersectionRatio > 0) {
        //plyrHandle.play()
      } else {
        //auto pause
        handle.pause()
      }
    }
  }, {
    root: document,
    rootMargin: '0px',
    threshold: [0, 1]
  })).observe(handle)
}

const Download = (url: string, fileName: string) => {
  let element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const VerifiedStatus = (verifiedInt: number = 0) => {
  const verifiedTypeList = [
    "business",
    'government'
  ]
  if (verifiedInt > 255 || verifiedInt <= 0) {
    return {verified: false, blue_verified: false, verified_type: undefined}
  } else {
    return {verified: !!(verifiedInt & 128), blue_verified: !!(verifiedInt & 64), verified_type: verifiedTypeList[(verifiedInt & 63) - 1]}
  }
}

export {ScrollTo, Notice, createRealMediaPath, NullSafeParams, Equal, VerifyQueryString, autoStopVideo, Download, VerifiedStatus}
