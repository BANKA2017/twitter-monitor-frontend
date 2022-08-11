import {ElNotification} from "element-plus";
import html2canvas from "html2canvas";

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

const H2C = (node: HTMLElement, fileName: string) => {
  html2canvas(node, {useCORS: true}).then(function(canvas) {
    Download(canvas.toDataURL(), fileName)
  });
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

export {ScrollTo, Notice, createRealMediaPath, NullSafeParams, Equal, H2C}
