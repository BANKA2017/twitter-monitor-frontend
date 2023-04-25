onmessage = (e) => {
    generateData(e.data[0], JSON.parse(e.data[1]))
}

let latestAccountListFilter = {}
const accountDataCache = new Map()
const groupDataCache = new Map()
const tmpProjectGenerate = (projectName, organization) =>  organization ? 'official': (projectName === 'BanGDream!' ? 'bangdream' : 'lovelive')

const tmpDataTemplateGenerator = (defaultU, defaultV) => ({
    tweets: defaultU,
    retweet: defaultU,
    hourCount: new Array(24).fill(0),
    mediaCount: new Array(24).fill(0),
    renameDepartment: {},
    trendsData: {
        label: {date: '日期'},
        color: [],
        followers: defaultV,
        statuses_count: defaultV,
    }
})

const tmpDataTemplate = () => ({
    tweets: [],
    retweet: [],
    hourCount: new Array(24).fill(0),
    mediaCount: new Array(24).fill(0),
    renameDepartment: {},
    trendsData: {
        label: {date: '日期'},
        color: [],
        followers: [],
        statuses_count: [],
    }
})

const tmpUserDataTemplate = () => ({
    tweets: {},
    retweet: {},
    hourCount: new Array(24).fill(0),
    mediaCount: new Array(24).fill(0),
    renameDepartment: {},
    trendsData: {
        label: {date: '日期'},
        color: [],
        followers: {},
        statuses_count: {},
    }
})

const generateData = (firstGenerate = false, state) => {
    //TODO fix type {[p in 'bangdream' | 'lovelive' | 'official']: dataTemplate}
    let tmpData = Object.values(state.accountComputedData).length === 0 ? {
        bangdream: tmpDataTemplate(),
        lovelive: tmpDataTemplate(),
        official: tmpDataTemplate()
    } : state.accountComputedData
    //pre check
    let tmpUpdateList = new Set()
    for (let projectName of ['bangdream', 'lovelive', 'official']) {
        if (latestAccountListFilter[projectName]) {
            let tmp = Object.values(latestAccountListFilter[projectName])
            let tmpOrigin = Object.values(state.accountListFilter[projectName])
            for (let valueIndex in tmp) {
                if (tmp[valueIndex] !== tmpOrigin[valueIndex]) {
                    tmpUpdateList.add(projectName)
                    tmpData[projectName] = tmpDataTemplate()
                    break
                }
            }
        } else if (!latestAccountListFilter[projectName]) {
            tmpUpdateList.add(projectName)
        }
    }
    for (let account of state.accountData) {
        //break
        let breakRender = false
        for (let projectMeta of account.projects) {
            let tmpProject = tmpProjectGenerate(projectMeta[0], account.organization)
            if (!tmpUpdateList.has(tmpProject) || (!account.organization && !state.accountListFilter[tmpProject][projectMeta[1]]) || (account.organization && !state.accountListFilter[tmpProject][projectMeta[0]])) {
                breakRender = true
                break
            }
        }
        if (breakRender) {
            continue
        }
        //console.log(account)
        let tmpPersonData = tmpUserDataTemplate()
        if (!firstGenerate) {
            let tmpCache = accountDataCache.get(account.name)
            if (typeof tmpCache === 'undefined') {continue}
            tmpPersonData = tmpCache
        } else {
            //每日数据
            for (let date in account.daily_data) {
                let tmpDate = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8)
                let tmpDailyTweetCount = account.daily_data[date].hour_count.length === 0 ? 0 : account.daily_data[date].hour_count.reduce((acr, cur) => acr + cur)
                let tmpRetweetCount = typeof(account.daily_data[date].origin) === 'undefined' ? 0 : tmpDailyTweetCount - (account.daily_data[date].origin)
                tmpPersonData.tweets[tmpDate] ? tmpPersonData.tweets[tmpDate] += tmpDailyTweetCount : tmpPersonData.tweets[tmpDate] = tmpDailyTweetCount
                tmpPersonData.retweet[tmpDate] ? tmpPersonData.retweet[tmpDate] += tmpRetweetCount : tmpPersonData.retweet[tmpDate] = tmpRetweetCount

                account.daily_data[date].hour_count.forEach((count, time) => {
                    tmpPersonData.hourCount[time] += count
                })
                account.daily_data[date].media.forEach((count, time) => {
                    tmpPersonData.mediaCount[time] += count
                })

                //三大件
                if ((account.name !== 'homoto_akina') && (account.name !== 'uchida_shu0524')) {
                    tmpPersonData.trendsData.followers[tmpDate] = account.daily_data[date].followers ? account.daily_data[date].followers : NaN
                    tmpPersonData.trendsData.statuses_count[tmpDate] = account.daily_data[date].statuses_count ? account.daily_data[date].statuses_count : NaN
                    //following: account.daily_data[date].following ? account.daily_data[date].following : NaN,
                    //statuses_count: account.daily_data[date].statuses_count ? account.daily_data[date].statuses_count : NaN,
                    //name: account.name,
                }
            }
            //tmpPersonData.tweets = Object.keys(tmpPersonData.tweets).map(day => [day, tmpPersonData.tweets[day]])
            //tmpPersonData.retweet = Object.keys(tmpPersonData.retweet).map(day => [day, tmpPersonData.retweet[day]])
            accountDataCache.set(account.name, tmpPersonData)
        }
        account.projects.forEach(projectMeta => {
            let tmpProject = tmpProjectGenerate(projectMeta[0], account.organization)
            //console.log(new Date(), tmpProject)
            //break
            if ((!account.organization && !state.accountListFilter[tmpProject][projectMeta[1]]) || (account.organization && !state.accountListFilter[tmpProject][projectMeta[0]])) {
                return
            }
            let group = account.organization ? projectMeta[0] : projectMeta[1]
            //label
            tmpData[tmpProject].trendsData.label[account.name] = state.displayNameList[account.name]
            tmpData[tmpProject].trendsData.color.push(state.accountColor.member[account.name])

            // 仅在首次处理时使用
            if (firstGenerate) {
                let tmpGroupData = tmpDataTemplateGenerator({}, {})
                if (groupDataCache.has(group)) {
                    let tmpGroupCache = groupDataCache.get(group)
                    if (typeof tmpGroupCache === 'undefined') {return}
                    tmpGroupData = tmpGroupCache
                }
                //合并数据
                Object.keys(tmpPersonData.tweets).forEach(date => {
                    tmpGroupData.tweets[date] ? tmpGroupData.tweets[date] += tmpPersonData.tweets[date] : tmpGroupData.tweets[date] = tmpPersonData.tweets[date]
                })
                Object.keys(tmpPersonData.retweet).forEach(date => {
                    tmpGroupData.retweet[date] ? tmpGroupData.retweet[date] += tmpPersonData.retweet[date] : tmpGroupData.retweet[date] = tmpPersonData.retweet[date]
                })
                for (let time in tmpPersonData.hourCount) {
                    tmpGroupData.hourCount[time] += tmpPersonData.hourCount[time]
                }
                for (let time in tmpPersonData.mediaCount) {
                    tmpGroupData.mediaCount[time] += tmpPersonData.mediaCount[time]
                }
                if ((account.name !== 'homoto_akina') && (account.name !== 'uchida_shu0524')) {
                    let baseFollowers = tmpPersonData.trendsData.followers["2021-01-01"]//only bangdream
                    Object.keys(tmpPersonData.trendsData.followers).forEach(date => {
                        if (!tmpGroupData.trendsData.followers[date]) {
                            tmpGroupData.trendsData.followers[date] = {}
                        }
                        tmpGroupData.trendsData.followers[date][account.name] = Number(tmpPersonData.trendsData.followers[date]) - Number(baseFollowers)// (tmpProject === 'bangdream' ? baseFollowers : 0)
                    })

                    let baseStatusesCount = tmpPersonData.trendsData.statuses_count["2021-01-01"]//only bangdream
                    Object.keys(tmpPersonData.trendsData.statuses_count).forEach(date => {
                        if (!tmpGroupData.trendsData.statuses_count[date]) {
                            tmpGroupData.trendsData.statuses_count[date] = {}
                        }
                        tmpGroupData.trendsData.statuses_count[date][account.name] = Number(tmpPersonData.trendsData.statuses_count[date]) - Number(baseStatusesCount)// (tmpProject === 'bangdream' ? baseStatusesCount : 0)
                    })
                }
                // 改名部
                let tmpChildren = {
                    name: account.name,
                    itemStyle: {color: state.accountColor.member[account.name]},
                    children: account.display_name_list.map(name => ({
                        name,
                        itemStyle: {color: state.accountColor.member[account.name]},
                        value: 1,
                    }))}
                if(tmpGroupData.renameDepartment[projectMeta[Number(!account.organization)]]) {
                    tmpGroupData.renameDepartment[projectMeta[Number(!account.organization)]].push(tmpChildren)
                } else {
                    tmpGroupData.renameDepartment[projectMeta[Number(!account.organization)]] = [tmpChildren]
                }
                groupDataCache.set(group, tmpGroupData)
            }
        })
    }
    //console.log(groupDataCache)
    for (let projectName of ['bangdream', 'lovelive', 'official']) {
        if (!tmpUpdateList.has(projectName) || tmpData[projectName] === undefined) {
            continue
        }
        // merge data from group cache
        for(let group of Object.keys(state.accountListFilter[projectName]).filter(groupName => state.accountListFilter[projectName][groupName])) {
            const tmpGroupData = groupDataCache.get(group)
            if (typeof tmpGroupData === 'undefined') {
                continue
            }
            // merge tweets and retweet
            Object.keys(tmpGroupData.tweets).forEach(date => {
                tmpData[projectName].tweets[date] ? tmpData[projectName].tweets[date] += tmpGroupData.tweets[date] : tmpData[projectName].tweets[date] = tmpGroupData.tweets[date]
            })
            Object.keys(tmpGroupData.retweet).forEach(date => {
                tmpData[projectName].retweet[date] ? tmpData[projectName].retweet[date] += tmpGroupData.retweet[date] : tmpData[projectName].retweet[date] = tmpGroupData.retweet[date]
            })
            // hour count
            for (let time in tmpGroupData.hourCount) {
                tmpData[projectName].hourCount[time] += tmpGroupData.hourCount[time]
            }
            for (let time in tmpGroupData.mediaCount) {
                tmpData[projectName].mediaCount[time] += tmpGroupData.mediaCount[time]
            }
            // trends
            Object.keys(tmpGroupData.trendsData.followers).forEach(date => {
                if (!tmpData[projectName].trendsData.followers[date]) {
                    tmpData[projectName].trendsData.followers[date] = {date}
                }
                tmpData[projectName].trendsData.followers[date] = {...tmpData[projectName].trendsData.followers[date], ...tmpGroupData.trendsData.followers[date]}
            })
            Object.keys(tmpGroupData.trendsData.statuses_count).forEach(date => {
                if (!tmpData[projectName].trendsData.statuses_count[date]) {
                    tmpData[projectName].trendsData.statuses_count[date] = {date}
                }
                tmpData[projectName].trendsData.statuses_count[date] = {...tmpData[projectName].trendsData.statuses_count[date], ...tmpGroupData.trendsData.statuses_count[date]}
            })
            // rename
            tmpData[projectName].renameDepartment = {...tmpData[projectName].renameDepartment, ...tmpGroupData.renameDepartment}
        }
        //改名部
        tmpData[projectName].renameDepartment = (Object.keys(tmpData[projectName].renameDepartment).map(groupName => ({
            name: groupName,
            itemStyle: {color: state.accountColor.group[groupName]},//.85不错
            children: tmpData[projectName].renameDepartment[groupName]
        })))
        //三大件
        tmpData[projectName].trendsData.followers = Object.values(tmpData[projectName].trendsData.followers)
        tmpData[projectName].trendsData.statuses_count = Object.values(tmpData[projectName].trendsData.statuses_count)
        //热力图
        tmpData[projectName].tweets = Object.keys(tmpData[projectName].tweets).map(date => [date, tmpData[projectName].tweets[date]])
        tmpData[projectName].retweet = Object.keys(tmpData[projectName].retweet).map(date => [date, tmpData[projectName].retweet[date]])
    }
    //tmpData.hourCount = tmpData.hourCount.map((count, time) => ({name: time + '时', value: count}))
    //tmpData.mediaCount = tmpData.mediaCount.map((count, time) => ({name: time + '时', value: count}))
    latestAccountListFilter = state.accountListFilter
        //state.accountComputedData = tmpData
    //console.log(tmpData)
    //state.loading = false

    postMessage([false, JSON.stringify(tmpData)])
}