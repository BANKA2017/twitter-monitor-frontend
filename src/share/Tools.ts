import {ElNotification} from "element-plus";

const ScrollTo = (top: number = 0): void => {
  window.scrollTo({
    top: top,
    behavior: "smooth"
  });
};

const Notice = (text: string = "", status: 'success' | 'warning' | 'info' | 'error' | undefined = 'success') => {
  ElNotification({
    message: text,
    type: status,
    duration: 1500
  });
}

export {ScrollTo, Notice}
