module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,

    publicPath: '/',

    pwa: {
        name: 'Twitter Monitor',
        themeColor: '#ffffff',
        msTileColor: '#000000',
        //appleMobileWebAppCapable: 'no',
        //appleMobileWebAppStatusBarStyle: 'black',
        // configure the workbox plugin (GenerateSW or InjectManifest)
        workboxPluginMode: 'GenerateSW',
        //workboxOptions: {
        //    // swSrc is required in InjectManifest mode.
        //    swSrc: 'src/service-worker.js',
        //    // ...other Workbox options...
        //},
        manifestOptions: {
            name: "Twitter Monitor",
            short_name: "tmv2",
            start_url: '.',
            display: 'standalone',
            theme_color: "#ffffff",
            icons: [{
                src: "static/img/icon.png",
                sizes: "144x144",
                type: "image/png"
            }]
        },
        iconPaths: {
            favicon32: 'static/img/icon.png',
            favicon16: 'static/img/icon.png',
            appleTouchIcon: 'static/img/icon.png',
            maskIcon: 'static/img/icon.png',
            msTileImage: 'static/img/icon.png'
        }
    }
};
