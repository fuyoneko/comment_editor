<template>
  <v-app style="background: #eeeeee">
    <v-app-bar app color="primary" dark>
      <help-dialog />
      <v-toolbar-title>チャット原稿</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn ref="copyButton" color="indigo lighten-5" class="indigo--text" @click="copyToText">COPY</v-btn>
    </v-app-bar>

    <v-main>
      <editor-main />
      <!-- スナックバー -->
      <v-snackbar v-model="snackbar.display" timeout="1500">
        コピーしました
        <br />
        <span class="blue-grey--text">{{ snackbar.message }}</span>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import EditorMain from "./components/editor-main";
import TextFormatter from "./components/logic/text-formatter";
import HelpDialog from "./components/dialog/help-dialog";

export default {
  name: "App",

  components: {
    "editor-main": EditorMain,
    "help-dialog": HelpDialog
  },

  data: () => ({
    snackbar: {
      display: false,
      message: ""
    }
  }),

  methods: {
    copyToText() {
      const rawText = this.$store.getters.rawText;
      if ((rawText || "").length == 0) {
        return;
      }
      const text = TextFormatter.parseToCopyText(rawText, "€");

      // クリップボードに保存する
      this.$copyText(text, this.$refs.copyButton.$el);
      // 履歴に登録する
      this.$store.commit("setHistory", {
        timestamp: Date.now(),
        date: `${new Date(Date.now()).toLocaleString()}`,
        text: rawText
      });
      // スナックバーで通知する
      this.snackbar.message = text;
      this.snackbar.display = true;
    }
  }
};
</script>
