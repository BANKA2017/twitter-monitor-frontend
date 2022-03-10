import { useRegisterSW } from 'virtual:pwa-register/vue'
import {ElNotification} from "element-plus";

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

if (offlineReady.value) {
  ElNotification({message: "Twitter Monitor ready to work offline", type: 'success'})
}
if (needRefresh.value) {
  ElNotification({
    message: "New content available, close this message to reload",
    type: 'success',
    duration: 0,
    onClose: () => updateServiceWorker(),
    position: 'bottom-right'
  })
}