// Inside vue.config.js
module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/registerServiceWorker.ts",
        },
        name: "Louwrisk",
        appleMobileWebAppCapable: true,
        themeColor: "#B1B2B4",
        msTileColor: "#B1B2B4",
        manifestOptions: {
            orientation: "landscape",
            display: "fullscreen",
            background_color: "#F1AD2D"
        }
    }
}