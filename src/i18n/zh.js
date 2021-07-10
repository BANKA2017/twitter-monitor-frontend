module.exports = {
    public: {
        search: "搜索",
        followers: "关注者",
        following: "正在关注",
        statuses_count: "总推文数",
        deleted: "删除",
        protected: "保护",
        retry: "重试",
        profile: "简介",
        tweet: "推文",
        error: "出错",
        translate: "翻译",
        loading: "加载中",
        timestamp: "时间戳"
    },
    timeline: {
        message: {
            not_exist: "@{0} 不存在",
            no_longer_monitor_deleted: "此账户已删除，我们将不再监控此账户",
            no_longer_monitor_protected: "此账户已被保护，我们将不再监控此账户",
            load_more: "加载更多",
            no_more: "已经没有更多的内容",
        },
        nav_bar: {
            all: '全部',
            origin: '原创',
            retweet: '转推',
            media: '媒体',
            no_image: '无图',
        },
        side_tags: {
            settings: "设置",
            about: "关于",
            stats: "统计",
            status: "状态",
            api: "API",
            media_download_tool: "媒体下载",
            rss: "RSS",
            backstage: "管理",
        },
        scripts: {
            time: "时间",
            message: {
                internet_speed_is_too_slow_now_image_display_has_been_turned_off: "当前网速较慢，已关闭图片显示",
                update_tweets: "已更新 {0} 条推文",//外语需要考虑单复数问题
                missing_parameter: "缺少参数",
                failed_to_generate_chart: "图表生成失败 #{0}",
            }
        }
    },
    translate: {
        message: {
            translate_by: "由 {0} 翻译",
            clean: "取消翻译",
            hide_translated: "隐藏翻译",//Hide translated Tweet
            translate_profile: "翻译简介",
            translate_tweet: "翻译推文",
        }
    },
    userinfo: {
        message: {
            load_success: "成功加载 {0} (@{1})"
        }
    }
}
