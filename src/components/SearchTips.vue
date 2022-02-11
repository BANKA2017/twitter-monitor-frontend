<template>
  <div id="searchTips">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ t("search.tips.tips") }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">
          {{ t("search.tips.tips_sub_title") }}
        </h6>
        <!--TODO TRANSLATE IT-->
        <ul class="card-body">
          <i18n-t keypath="search.tips.line1" tag="li">
            <template #at><code>@</code></template>
          </i18n-t>
          <i18n-t keypath="search.tips.line2" tag="li">
            <template #hashtag><code>#</code></template>
          </i18n-t>
          <i18n-t keypath="search.tips.line3" tag="li">
            <template #cashtag><code>$</code></template>
          </i18n-t>
          <i18n-t keypath="search.tips.line4" tag="li">
            <template #at_username><code>@username</code></template>
          </i18n-t>
          <i18n-t keypath="search.tips.line5" tag="li"></i18n-t>
          <i18n-t keypath="search.tips.line6" tag="li">
            <template #help_en><code>help</code></template>
            <template #help_zh><code>帮助</code></template>
          </i18n-t>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n"
const { t } = useI18n()
</script>

<style scoped>
</style>
