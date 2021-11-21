<template>
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-textarea
          v-model="value"
          ref="genko"
          placeholder="日本語を入力"
          :style="textareaStyle"
          no-resize
          auto-grow
          :counter="wordsMaxLength"
          :counter-value="countetValue"
          :rules="[counterLimits]"
        ></v-textarea>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import SvgFormatter from "./logic/svg-formatter";
import TextFormatter from "./logic/text-formatter";

export default {
  data() {
    return {
      // 行あたりの文字数
      wordsCount: 15,
      // 全体の入力可能文字数
      wordsMaxLength: 120
    };
  },
  computed: {
    /**
     * 原稿用紙の幅：文字数分の幅を設定する
     */
    textareaStyle() {
      return `width:${this.wordsCount}em`;
    },
    /**
     * 原稿用紙の入力値：共通ストアと同期する
     */
    value: {
      get() {
        return this.$store.getters.rawText;
      },
      set(text) {
        this.$store.commit("setRawText", text);
      }
    }
  },
  /**
   * 原稿用紙の背景を描画する
   */
  mounted() {
    // 原稿用紙の対象になるテキストエリアの大きさを取る
    let textarea = document.getElementsByTagName("textarea")[0];
    let bounds = textarea.getBoundingClientRect();
    // 等幅フォントの縦横比
    let fontAspect = 28.0 / 16.0;

    // テキストエリアを横に文字数分で分割したときの、1文字当たりの幅と高さを取る
    const fontWidth = Math.floor(bounds.width / this.wordsCount);
    const wordsSize = {
      width: fontWidth,
      height: Math.floor(fontWidth * fontAspect),
      lineWidth: 1
    };

    // SVGの管理インスタンスを作成
    let svg = new SvgFormatter(
      wordsSize.width * this.wordsCount,
      wordsSize.height
    );
    for (let index = 0; index < this.wordsCount; index++) {
      // 原稿用紙の枠の大きさを取る
      const rect = {
        x: Math.floor(wordsSize.lineWidth / 2 + index * wordsSize.width),
        y: Math.floor(wordsSize.lineWidth / 2),
        width: wordsSize.width - wordsSize.lineWidth,
        height: wordsSize.height - wordsSize.lineWidth
      };
      // 実線、点線、それぞれのペン情報を作成する
      const penLine = {
        stroke: "lightgray",
        fill: "none",
        "stroke-width": wordsSize.lineWidth
      };
      const penDash = {
        stroke: "lightgray",
        fill: "none",
        "stroke-width": wordsSize.lineWidth,
        "stroke-dasharray": "3"
      };

      // 上罫線
      svg.append("line", {
        ...{
          x1: rect.x,
          x2: rect.x + rect.width,
          y1: rect.y,
          y2: rect.y
        },
        ...penLine
      });
      // 左罫線
      svg.append("line", {
        ...{
          x1: rect.x,
          x2: rect.x,
          y1: rect.y,
          y2: rect.y + rect.height
        },
        ...penDash
      });
      // 右罫線
      svg.append("line", {
        ...{
          x1: rect.x + rect.width,
          x2: rect.x + rect.width,
          y1: rect.y,
          y2: rect.y + rect.height
        },
        ...((index + 1) % 5 == 0 ? penLine : penDash)
      });
      // 下罫線
      svg.append("line", {
        ...{
          x1: rect.x,
          x2: rect.x + rect.width,
          y1: rect.y + rect.height,
          y2: rect.y + rect.height
        },
        ...penLine
      });
    }

    // テキストエリアの背景に原稿用紙の枠線を適用する
    textarea.style.backgroundImage = svg.url;
    textarea.style.backgroundSize = `${this.wordsCount}em`;
  },
  methods: {
    /**
     * 入力文字数上限の現在の文字数を返す
     */
    countetValue(text) {
      return TextFormatter.getLength(text || "");
    },
    /**
     * 入力文字数上限の入力チェックを返す
     */
    counterLimits(text) {
      return (
        TextFormatter.getLength(text || "") <= this.wordsMaxLength ||
        `文字数は${this.wordsMaxLength}文字が上限です`
      );
    },
    /**
     * カーソル位置にテキストを挿入する
     */
    insertTextOnCursor(text) {
      // テキストエリアを取得する
      const textarea = this.$refs.genko.$el.querySelector("textarea");
      // カーソル位置を取得する
      const start = textarea.selectionStart;
      // カーソルよりも前のテキスト、カーソルよりも後ろのテキストを取得する
      const before = this.value.substring(0, start);
      const after = this.value.substring(start);
      // カーソル位置に引数のテキストを挿入する
      this.value = before + text + after;
    }
  }
};
</script>

<style>
textarea {
  font-family: "Kosugi", sans-serif !important;
  word-break: break-all;
  background-position: left top !important;
  background-repeat: repeat-y !important;
}
</style>
