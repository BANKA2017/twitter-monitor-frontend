const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

module.exports = {
    //build: {
        //index: path.resolve(__dirname, 'dist/index.html'),
        //assetsRoot: path.resolve(__dirname, 'dist'),
        //assetsSubDirectory: 'static',
        //assetsPublicPath: '/twitter',

        productionSourceMap: true,
    //},
    publicPath: '/twitter',
    //mode: 'production'

    configureWebpack: () => {
        if (process.env.NODE_ENV === "production") {
            return {
                plugins: [
                    new PrerenderSPAPlugin({
                        staticDir: path.join(__dirname, "dist"),
                        routes: ["/", "/about", "/api", "/account", "/i/stats", "/i/status",],
                        renderer: new Renderer({
                            inject: {
                                foo: "bar"
                            },
                            headless: false,
                        })
                    })
                ]
            };
        }
    }
};
