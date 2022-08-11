<template>
  <single-page-header title="Snowflake" />
  <div class="my-3 container">
    <div class="row">
      <div class="col-md-6">
        <el-input type="text" v-model="state.snowFlake" clearable class="mb-3"></el-input>
        <ul >
          <li v-for="(value, key) in snowFlakeInfo" :key="key"><span class="text-capitalize">{{key.replaceAll('_', ' ')}}</span>: <code>{{value}}</code></li>
        </ul>
        <code>
          <pre>{{JSON.stringify(snowFlakeInfo, undefined, 2)}}</pre>
        </code>
        <hr class="my-4">
        <div class="card">
          <div class="card-body">
            <p class="lead">拓展阅读</p>
            <ul >
              <li ><a href="https://blog.nest.moe/posts/about-snowflakes#snowflakes%E7%9A%84%E7%94%B1%E6%9D%A5" target="_blank" class="end-of-link">Snowflakes的由来</a></li>
              <li ><a href="https://docs.google.com/document/d/1xVrPoNutyqTdQ04DXBEZW4ZW4A5RAQW2he7qIpTmG-M/edit" target="_blank" class="end-of-link">Reconstructing Twitter's Firehose</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SinglePageHeader from "@/components/SinglePageHeader.vue"
import {computed, reactive} from "vue";
const state = reactive<{
  snowFlake: string
}>({
  snowFlake: '0'
})
const snowFlakeSample = " +----------------------   Snowflake IDs  64bits   ----------------------+\n |                                                                       |\n |                                                Machine id             |\n |                                                  10 bits              |\n |                                               +---------+             |\n v                                               v         v             v\n 0 0000000000 0000000000 0000000000 0000000000 0 00000 00000 0000000000 00\n ^ ^                                           ^ ^   ^ ^   ^ ^           ^\n | |                                           | |   | |   | |           |\n | +-------------------------------------------+ +---+ +---+ +-----------+\nSign                      Time                    DCID   SID   Sequence number\n1bit                     41bits                   5bits  5bits      12 bits\n\nDCID = Datacenter id\n SID = Server id\n"
const convertSnowFlakes = (snowFlake: string) => {
  let tmpSnowFlakeInfo: {
    creation_time_milli: Date
    machine_id: number
    datacenter_id: number
    server_id: number
    sequence_id: number
  } = {
    creation_time_milli: new Date(0),
    machine_id: 0,
    datacenter_id: 0,
    server_id: 0,
    sequence_id: 0,
  }
  try {
    let tmpSnowFlake = BigInt(snowFlake)
    // Sequence number
    tmpSnowFlakeInfo.sequence_id = Number(tmpSnowFlake & BigInt(0b111111111111))
    tmpSnowFlake >>= BigInt(12)

    // Machine id
    tmpSnowFlakeInfo.machine_id = Number(tmpSnowFlake & BigInt(0b1111111111))
    tmpSnowFlakeInfo.server_id = tmpSnowFlakeInfo.machine_id & 0b11111
    tmpSnowFlakeInfo.datacenter_id = (tmpSnowFlakeInfo.machine_id>>5) & 0b11111
    tmpSnowFlake >>= BigInt(10)

    // Time
    tmpSnowFlakeInfo.creation_time_milli = new Date(Number(BigInt(1288834974657) + (tmpSnowFlake & BigInt(0b0111111111111111111111111111111111111111111111111111))))

  } catch (e) {
  }
  return tmpSnowFlakeInfo
}
const snowFlakeInfo = computed(() => convertSnowFlakes(state.snowFlake))

</script>

<style scoped lang="scss">
  .end-of-link {
    &::after {
      content: " ↗";
    }
  }
</style>