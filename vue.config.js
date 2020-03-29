// Inside vue.config.js
module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        manifestOptions: {
            orientation: "landscape",
            display: "fullscreen",
            start_url: "./index.html",
            background_color: "#F1AD2D"
        }
    }
}