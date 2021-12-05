<template>
    <div id="projectList">
        <!--有确定的project-->
        <template v-if="project">
            <button class="btn btn-outline-primary btn-block btn-sm" @click="projectS = !projectS">{{ project }}
            </button>
            <div class="my-4"></div>
        </template>
        <!--未确定project-->
        <template v-else>
            <router-link class="btn btn-outline-primary btn-block btn-sm" to="/">{{ $t("project_list.button.select_project") }}</router-link>
            <div class="my-4"></div>
        </template>
        <template v-if="projectS">
            <div class="list-group">
                <router-link
                    v-for="project_ in projects"
                    :key="project_" :to="`/i/project/`+project_" @click="projectS = !projectS"
                    :class="`list-group-item list-group-item-action`+(project_.toLowerCase() === project.toLowerCase() ? ' active' : '')">{{ project_ }}
                </router-link>
            </div>
            <div class="my-4"></div>
        </template>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "projectList",
        data() {
            return {
                projectS: false
            }
        },
        computed: mapState({
          project: 'project',
          projects: 'projects',
        })
    }
</script>

<style scoped>

</style>
