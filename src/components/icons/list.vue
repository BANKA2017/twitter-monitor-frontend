<template>
  <svg :class="`bi bi-image `+status" :height="width" :width="width" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M19.75 2H4.25C3.013 2 2 3.013 2 4.25v15.5C2 20.987 3.013 22 4.25 22h15.5c1.237 0 2.25-1.013 2.25-2.25V4.25C22 3.013 20.987 2 19.75 2zM11 16.75H7c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h4c.414 0 .75.336.75.75s-.336.75-.75.75zm6-4H7c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h10c.414 0 .75.336.75.75s-.336.75-.75.75zm0-4H7c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h10c.414 0 .75.336.75.75s-.336.75-.75.75z"></path>
  </svg>
</template>

<script>
export default {
  name: "list",
  props: {
    status: String,
    width: String,
    height: String
  }
}
</script>

<style scoped>

</style>
