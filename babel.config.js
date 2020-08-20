module.exports = {
    "presets": [
        ["@vue/app", {
            "modules": false,
            polyfills: [
                'es.promise',
                'es.symbol',
            ]
        }]
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ]
    ]
}
