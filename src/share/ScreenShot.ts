import html2canvas from "html2canvas";
import {Download} from "@/share/Tools";

const H2C = (node: HTMLElement, fileName: string) => {
  html2canvas(node, {useCORS: true}).then(function(canvas) {
    Download(canvas.toDataURL(), fileName)
  });
}

export {H2C}