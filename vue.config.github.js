module.exports = {
  outputDir: "docs",
  publicPath: "/comment_editor/",
  pages: {
    index: {
      entry: "src/main.js",
      title: "チャット原稿",
    },
  },
  transpileDependencies: ["vuetify"],
};
