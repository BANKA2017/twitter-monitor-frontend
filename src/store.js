/* 先填写 .env.local */
import { createStore } from "vuex";
import { i18n } from "@/main";

const devmode = process.env.NODE_ENV === "development"
const basePath = !devmode ? process.env.VUE_APP_PRO_BASE_PATH : process.env.VUE_APP_DEV_BASE_PATH
const mediaPath = process.env.VUE_APP_MEDIA_PATH ? process.env.VUE_APP_MEDIA_PATH : basePath + '/api/v2/media/'
const twemojiBasePath = process.env.VUE_APP_TW_EMOJI_PATH//twemoji
const onlinePath = process.env.VUE_APP_ONLINE_PATH

export default createStore({
    state() {
        return {
            now: new Date(),
            projects: [],
            names: [],
            languageList: require('./assets/language_list'),
            links: [],
            home: true,
            project: "",
            title: "Twitter Monitor",
            tweets: [],
            height: 0,
            width: 0,
            altitudeDifference: 0,
            hasBeenSyncFromLocalStorage: false,
            devmode: devmode,
            settings: {
                data: {
                    language: "zh-cn",//简体中文
                    cookie_accept: false,
                    displayPicture: false,
                    basePath,
                    mediaPath,
                },
                panel: false,
                adminStatus: false,
            },
            userTimeZone: '',
            userList: [],

            //path
            samePath: false,
            realMediaPath: '',
            twemojiBasePath: twemojiBasePath,
            onlinePath: onlinePath,
        }
    },
    mutations: {
        setLanguage: (state, payload) => {
            i18n.locale = payload.lang
            state.settings.data.language = payload.lang
        },
        updateUserList: (state, payload) => state.userList = payload.users,
        updateNow: (state, payload) => state.now = payload.now,
        setTrueToHasBeenSyncFromLocalStorage: (state) => state.hasBeenSyncFromLocalStorage = true,
        setSettings: (state, payload) => state.settings[payload.node] = payload.data,
        setUserTimeZone: (state, payload) => state.userTimeZone = payload.userTimeZone,
        //browser
        updateBrowserSize: (state, payload) => {
            state.height = payload.height
            state.width = payload.width
            state.altitudeDifference = payload.altitudeDifference
        },
        //settings
        swapDisplayPictureStatus: (state) => state.settings.data.displayPicture = !state.settings.data.displayPicture,
        updateDisplayPictureStatus: (state, payload) => state.settings.data.displayPicture = payload.status,
        updateBasePath: (state, payload) => state.settings.data.basePath = payload.basePath,
        updateMediaPath: (state, payload) => state.settings.data.mediaPath = payload.mediaPath,
        checkSamePath: (state) =>state.samePath = (state.settings.data.basePath === state.settings.data.mediaPath),
        updateRealMediaPath: (state, payload) => state.realMediaPath = payload.realMediaPath,
        //set core data
        setCoreValue: (state, payload) => state[payload.key] = payload.value,
        //pushCoreValue: (state, payload) => state[payload.key] = state[payload.key].concat(payload.value),
    },
    actions: {
        setLanguage: function (context, payload) {
            context.commit({
                type: 'setLanguage',
                lang: ((lang) => {
                    if (/^(?:zh|zh-cn|zh-sg|zh-hans)$/.test(lang)) {
                        return 'zh-cn'
                    } else if (/^(?:zh-tw|zh-hk|zh-mo|zh-hant)$/.test(lang)) {
                        return 'zh-tw'
                    } else if (/^(?:ja|ja-jp)$/.test(lang)) {
                        return 'ja'
                    } else if (/^(?:ko|ko-kp)$/.test(lang)) {
                        return 'ko'
                    } else {
                        return 'en'
                    }
                })(payload.lang)
            })
        },
        updateUserList: function (context) {
            let users = [];
            //TODO 更好的拍平技巧？
            Object.keys(context.state.names).forEach(project => {
                Object.keys(context.state.names[project]).forEach(group => {
                    Object.keys(context.state.names[project][group]).forEach(member => {
                        users.push({
                            name: context.state.names[project][group][member]["name"],
                            display_name: context.state.names[project][group][member]["display_name"],
                            project: project,
                            tag: group
                        });
                    })
                })
            });
            //state.names.map((projectItems, project) => projectItems.map((groupItems, group) => groupItems.map(member => {
            //    users.push({
            //        name: member.name,
            //        display_name: member.display_name,
            //        project: project,
            //        tag: group
            //    })
            //})))
            context.commit({type: 'updateUserList', users: users})
        },
        updateNow: (context) => context.commit({type: 'updateNow', now: new Date()}),
        setTrueToHasBeenSyncFromLocalStorage: (context) => context.commit('setTrueToHasBeenSyncFromLocalStorage'),
        setSettings: (context, payload) => context.commit({type: 'setSettings', node: payload.node, data: payload.data}),
        setUserTimeZone: (context) => {
            let timeValue = (new Date().getTimezoneOffset() / 60) * (-1);
            context.commit({type: 'setUserTimeZone', userTimeZone: (timeValue >= 0 ? '+' + timeValue.toString() : timeValue.toString())})
        },
        //browser
        updateBrowserSize: (context, payload) => {
            context.commit({
                type: 'updateBrowserSize',
                height: payload.height,
                width: payload.width,
                altitudeDifference: payload.altitudeDifference
            })
        },
        //settings
        swapDisplayPictureStatus: (context) => context.commit('swapDisplayPictureStatus'),
        updateDisplayPictureStatus: (context, payload) => context.commit({type: 'updateDisplayPictureStatus', status: payload.status}),
        updateBasePath: (context, payload) => context.commit({type: 'updateBasePath', basePath: payload.basePath}),
        updateMediaPath: (context, payload) => context.commit({type: 'updateMediaPath', mediaPath: payload.mediaPath}),
        checkSamePath: (context) => context.commit({type: 'checkSamePath'}),
        updateRealMediaPath: (context) => context.commit({type: 'updateRealMediaPath', realMediaPath: context.state.settings.data.mediaPath + (context.state.settings.data.mediaPath === context.state.settings.data.basePath ? '/api/v2/media/' : '')}),
        //set core data
        setCoreValue: (context, payload) => context.commit({type: 'setCoreValue', key: payload.key, value: payload.value}),
        pushCoreValue: (context, payload) => context.commit({type: 'setCoreValue', key: payload.key, value: context.state[payload.key].concat(payload.value)}),
    }
})
