<template />
<script setup lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/vue'
  import {ElNotification} from "element-plus";
  import {onMounted, watch} from "vue";
  import {useI18n} from "vue-i18n";
  const {
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW()
  const { t } = useI18n()
  watch(needRefresh, () => {
    ElNotification({
      message: t("pwa.need_refresh"),
      type: 'success',
      duration: 0,
      position: 'bottom-right'
    })
  })
  let updatedFlag = false
  onMounted(() => {
    window.addEventListener('beforeunload', () => {
      if (needRefresh.value  && !updatedFlag) {
        updatedFlag = true
        updateServiceWorker()
      }
    })
  })
</script>
