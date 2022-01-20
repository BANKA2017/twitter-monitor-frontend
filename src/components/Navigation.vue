<template>
  <nav id="Navigation" class="navbar navbar-expand-lg navbar-light text-center bg-light" style="z-index: 1001">
    <span class="navbar-brand mb-0 h1 d-inline-block text-truncate" style="max-width: 250px;">
      {{ displayName }}
    </span>
    <div class="btn-group" role="group">
      <button class="btn navbar-toggler" type="button" @click="$router.go(-1)">
        <span><chevron-left height="30" status="text-success" width="30"/></span>
      </button>
      <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" class="btn navbar-toggler" data-target="#navbarNav" data-toggle="collapse" type="button" v-if="project && projects.length && displayType === 'timeline'">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
    <div class="collapse navbar-collapse" id="navbarNav" v-if="displayType === 'timeline'">
      <ul v-if="project" class="navbar-nav">
        <li v-for="(values, key) in names[project]" :key="key" class="nav-item dropdown">
          <router-link aria-expanded="false" aria-haspopup="true" class="nav-link dropdown-toggle" data-toggle="dropdown" id="navbarDropdown" is="a" role="button" style="cursor:pointer" v-if="names[project][key].length > 1" to="">
            {{ key }}
          </router-link>
          <router-link :to="`/`+(values[0].projects.length <= 1 ? '' : 'project/'+project+'/')+values[0].name+`/all`" class="nav-link" v-else>{{ values[0].display_name }}
          </router-link>
          <div aria-labelledby="navbarDropdown" class="dropdown-menu" v-if="names[project][key].length > 1">
            <div :key="value.display_name" v-for="value in values">
              <router-link :class="`dropdown-item `+(value.name ? '' : 'disabled')" :to="`/`+value.name+`/all`">{{ value.display_name }}
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
    import {computed} from "vue"
    import {useStore} from "@/store";
    import ChevronLeft from "@/icons/ChevronLeft.vue";

    defineProps({
      displayName: {
        type: String,
        default: "Twitter Monitor"// + (Vue.prototype.onlinePath ? ' Online': ''),
      },
      displayType: String,
    })
    const store = useStore()
    const names = computed(() => store.state.names)
    const project = computed(() => store.state.project)
    const projects = computed(() => store.state.projects)
</script>

<style scoped>

</style>
