<template>
    <div id="projectList">
        <!--有确定的project-->
        <template v-if="$root.project">
            <button @click="projectS = !projectS" class="btn btn-outline-primary btn-block btn-sm">{{ $root.project }}
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
                        :class="`list-group-item list-group-item-action`+(project_.toLowerCase() === $root.project.toLowerCase() ? ' active' : '')"
                        :key="project_" :to="`/i/project/`+project_" @click="projectS = !projectS"
                        v-for="project_ in $root.projects">{{ project_ }}
                </router-link>
            </div>
            <div class="my-4"></div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "projectList",
        data() {
            return {
                projectS: false
            }
        }
    }
</script>

<style scoped>

</style>
