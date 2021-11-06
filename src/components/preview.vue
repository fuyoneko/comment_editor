<template>
  <div class="preview-background-base" :class="historyClass">
    <v-row align="center">
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-avatar size="28" color="white">
          <v-icon>mdi-account-circle</v-icon>
        </v-avatar>
      </v-col>
      <v-col cols="auto">
        <div class="preview-background">
          <div v-ripple @click="onClickPreview" class="preview" v-html="contents"></div>
        </div>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    /**
     * 履歴であればCSSクラスを変更する
     */
    historyClass() {
      if (this.isHistory) {
        return "history-preview";
      }
      return "";
    }
  },
  props: ["contents", "isHistory", "rawText"],
  methods: {
    /**
     * プレビュー表示／履歴表示をクリックした
     */
    onClickPreview() {
      if (this.isHistory) {
        this.$emit("on-click-preview", {
          htmlText: this.contents,
          rawText: this.rawText
        });
      }
    }
  }
};
</script>

<style>
.history-preview {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: burlywood;
}
.preview {
  font-family: "Kosugi", sans-serif !important;
  white-space: nowrap;
  max-width: 16em;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  padding-left: 0.4em;
  padding-right: 0.4em;
  color: rgb(139, 126, 108);
  background-color: rgb(235, 227, 206);
  border-radius: 0.2em;
}
.preview-background {
  background-color: rgb(13, 12, 7);
  padding-left: 0em;
  padding-right: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
}
.preview-background-base {
  background-color: rgb(13, 12, 7);
}
</style>
