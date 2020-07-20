<template>
    <nav class="navbar navbar-expand-lg navbar-light text-center bg-light sticky-top" id="Navigation">
        <span class="navbar-brand mb-0 h1 d-inline-block text-truncate" style="max-width: 250px;">
          {{ displayName }}
        </span>
        <div class="btn-group" role="group">
            <button @click="$router.go(-1)" class="navbar-toggler" type="button"><span>
            <chevron-left height="30" status="text-success" width="30"/>
          </span>
            </button>
            <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                    class="navbar-toggler" data-target="#navbarNav" data-toggle="collapse" type="button"
                    v-if="$root.project && $root.projects.length && displayType === 'timeline'">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav" v-if="displayType === 'timeline'">
            <ul class="navbar-nav" v-if="$root.project">
                <li :key="key" class="nav-item dropdown" v-for="(values, key) in $root.names[$root.project]">
                    <router-link aria-expanded="false" aria-haspopup="true" class="nav-link dropdown-toggle"
                                 data-toggle="dropdown" id="navbarDropdown" is="a" role="button" style="cursor:pointer"
                                 to="" v-if="$root.names[$root.project][key].length > 1">
                        {{ key }}
                    </router-link>
                    <router-link
                            :to="`/`+(values[0].projects.length <= 1 ? '' : 'project/'+$root.project+'/')+values[0].name+`/all`"
                            class="nav-link" v-else>{{ values[0].display_name }}
                    </router-link>
                    <div aria-labelledby="navbarDropdown" class="dropdown-menu"
                         v-if="$root.names[$root.project][key].length > 1">
                        <div :key="value.display_name" v-for="value in values">
                            <router-link :class="`dropdown-item `+(value.name ? '' : 'disabled')"
                                         :to="`/`+value.name+`/all`">{{ value.display_name }}
                            </router-link>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    import ChevronLeft from "../icons/chevronLeft";

    export default {
        name: "Navigation",
        components: {ChevronLeft},
        props: {
            displayName: {
                type: String,
                default: "Twitter",
            },
            displayType: String,
        }
    }
</script>

<style scoped>

</style>
