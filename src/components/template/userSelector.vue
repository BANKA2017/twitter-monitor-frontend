<template>
    <div id="userSelector">
        <div class="jumbotron">
            <h1 class="display-4">Twitter Monitor</h1>
        </div>
        <div class="container">
            <div class="col-md-8 offset-md-2">
                <search name="" :search="search" :display-type="displayType"/>
                <div class="list-group" v-if="project && names[project] && !home">
                    <router-link :to="`/i/project/`+user.project+`/`+user.name+`/all`" class="list-group-item list-group-item-action" v-for="(user, s) in userWithProjectList" :key="s"><b>{{ user.display_name }}</b> | <small>@{{ user.name }}</small> > <small>{{ project + ' (' + user.tag + ')' }}</small></router-link>
                    <div class="my-4"></div>
                </div>
                <el-row>
                    <template v-for="(project, s) in projects">
                        <router-link :to="`/i/project/`+project" :key="s">
                            <el-button size="mini" class="text-decoration-none" round>{{ project }}</el-button>
                        </router-link>
                    </template>
                </el-row>
                <div class="my-4"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import Search from "../search";
    export default {
        name: "userSelector",
        components: {Search},
        props: {
            home: Boolean,
            search: Object,
            displayType: String,
            project: String,
            projects: Array,
            names: {
                type: Object,
                default: () => {},
            },
            userWithProjectList: Array,
        }
    }
</script>

<style scoped>

</style>
