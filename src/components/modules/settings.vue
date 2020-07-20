<template>
    <el-drawer :visible.sync="$root.settings.panel" direction="btt" id="settings" title="设置">
        <div class="modal-body">
            <label for="selectLaguage">语言</label>
            <select class="form-control" id="selectLaguage" v-model="$root.settings.data.language">
                <option :key="language.code" :selected="$root.settings.data.language === language.code"
                        :value="language.code" v-for="language in $root.languageList">{{ language.local_name }}
                </option>
            </select>
        </div>
    </el-drawer>
</template>

<script>
    export default {
        name: "settings"
    }
</script>

<style scoped>

</style>
