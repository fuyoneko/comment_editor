<template>
  <v-container>
    <v-card>
      <v-tabs grow background-color="indigo lighten-5" slider-size="3" v-model="tab" icons-and-text>
        <v-tabs-slider color="indigo"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item.key">
          {{ item.title }}
          <v-icon>{{item.icon}}</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.key">
          <v-card flat class="mt-1" :style="item.style">
            <v-card-text>
              <template v-if="item.key == 1">
                <editor ref="genkoEditor" />
                <v-divider></v-divider>
                <v-row class="mt-1" justify="start">
                  <v-col cols="auto" v-for="icon in editIcons" :key="icon.key">
                    <v-container>
                      <v-row>
                        <v-btn :color="icon.color" outlined icon @click.stop="icon.onClick">
                          <v-icon>{{icon.icon}}</v-icon>
                        </v-btn>
                      </v-row>
                      <v-row justify="center" :class="`caption ${icon.color}--text`">{{icon.title}}</v-row>
                    </v-container>
                  </v-col>
                </v-row>
              </template>
              <template v-if="item.key == 2">
                <preview :contents="previewContent" :isHistory="false" />
              </template>
              <template v-if="item.key == 3 && historyCount == 0">
                <div
                  class="pa-4"
                  style="background-color: rgb(13, 12, 7); width: 100%; color: burlywood;"
                >
                  履歴がありません
                  <br />
                  <br />※COPYを押すと5件まで履歴に登録されます
                </div>
              </template>
              <template v-if="item.key == 3 && historyCount != 0">
                <preview
                  v-for="item in history"
                  :key="item.index"
                  :contents="item.text"
                  :rawText="item.rawText"
                  :isHistory="true"
                  @on-click-preview="onClickHistory"
                >
                  <div class="history-datetime text-caption">{{item.date}}</div>
                  <div class="history-datetime text-caption">吹き出しをタップして再編集</div>
                </preview>
              </template>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <emoji-dialog ref="emojiEditor" @on-clicked-emoji="appendEmoji" />
    </v-card>
    <!-- 履歴からの読み出しダイアログ -->
    <confirm-dialog ref="readFromHistory" @on-click-ok="readTextToEditor">
      <v-card-text class="pt-4">このテキストを原稿用紙に読み込みます、よろしいですか？</v-card-text>
      <v-divider></v-divider>
      <v-card-text v-html="dialogText" class="pt-4"></v-card-text>
      <v-divider></v-divider>
      <template #ok="{callback}">
        <v-btn color="primary" text @click="callback">読み込む</v-btn>
      </template>
    </confirm-dialog>
    <!-- 削除確認ダイアログ -->
    <confirm-dialog ref="deleteEditor" @on-click-ok="deleteDraft">
      <v-card-text class="pt-4">原稿用紙のテキストを破棄します、よろしいですか？</v-card-text>
      <v-divider></v-divider>
      <template #ok="{callback}">
        <v-btn color="red" text @click="callback" :disabled="isDisabledDelete">削除</v-btn>
      </template>
    </confirm-dialog>
    <!-- 縦書き変換確認ダイアログ -->
    <confirm-dialog ref="transposeEditor" @on-click-ok="transposeText">
      <v-card-text class="pt-4">原稿用紙のテキストを縦書きに変換します、よろしいですか？</v-card-text>
      <v-divider></v-divider>
      <v-card-text class="pt-4">
        <span class="red--text">※縦書きから横書きへの再変換はできません。</span>変換前のテキストは履歴に登録されますので、縦書きから横書きに戻す場合は、履歴から戻してください。
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text class="pt-4">
        ※変換には以下の条件があります
        <div>・7行以下であること</div>
        <div>・すべての行が7文字以下であること</div>
        <div>・英数字を含まないこと</div>
      </v-card-text>
      <template #ok="{callback}">
        <v-btn color="primary" text @click="callback" :disabled="isDisabledTransposeText">縦書きに変換</v-btn>
      </template>
    </confirm-dialog>
  </v-container>
</template>
<script>
import TextFormatter from "./logic/text-formatter";
import Editor from "./editor";
import Preview from "./preview";
import ConfirmDialog from "./dialog/confirm-dialog";
import EmojiDialog from "./dialog/emoji-dialog";
export default {
  components: {
    editor: Editor,
    preview: Preview,
    "confirm-dialog": ConfirmDialog,
    "emoji-dialog": EmojiDialog
  },
  data() {
    return {
      // 選択中のタブの情報
      tab: null,
      // 履歴ダイアログに表示するテキスト
      dialogText: "",
      dialogRawText: "",
      // タブの表示コンテンツ
      items: [
        {
          key: 1,
          title: "原稿用紙",
          icon: "mdi-lead-pencil",
          style: ""
        },
        {
          key: 2,
          title: "プレビュー",
          icon: "mdi-card-search",
          style: "background-color: rgb(13, 12, 7);"
        },
        {
          key: 3,
          title: "履歴",
          icon: "mdi-clipboard-text-clock",
          style: "background-color: rgb(13, 12, 7);"
        }
      ],
      // 原稿用紙下アイコンの表示コンテンツ
      editIcons: [
        {
          key: 1,
          icon: "mdi-delete",
          color: "red",
          title: "削除",
          onClick: this.onClickDeleteButton
        },
        {
          key: 2,
          icon: "mdi-rotate-left-variant",
          color: "primary",
          title: "縦書",
          onClick: this.onClickTransposeEdit
        },
        {
          key: 3,
          icon: "mdi-emoticon-excited-outline",
          color: "orange",
          title: "絵文字",
          onClick: this.onClickEmotionButton
        }
      ]
    };
  },
  computed: {
    /**
     * プレビュー表示するテキストを返す
     */
    previewContent() {
      const rawText = this.$store.getters.rawText;
      if ((rawText || "").length == 0) {
        return "（入力がありません）";
      }
      return TextFormatter.parseToPreviewText(rawText);
    },
    /**
     * 履歴の登録数を返す
     */
    historyCount() {
      return this.$store.getters.history.length;
    },
    /**
     * 履歴を返す
     */
    history() {
      const history = this.$store.getters.history;
      return history.map((content, index) => {
        if ((content.text || "").length == 0) {
          return "（入力がありません）";
        }
        return {
          index: index,
          date: content.date,
          rawText: content.text,
          text: TextFormatter.parseToPreviewText(content.text)
        };
      });
    },
    /**
     * 縦書きボタンが有効であればtrueを返す
     */
    isDisabledTransposeText() {
      const original = this.$store.getters.rawText;
      return !TextFormatter.canTransposeText(original);
    },
    /**
     * 削除ボタンが有効であればtrueを返す
     */
    isDisabledDelete() {
      const original = this.$store.getters.rawText;
      return original.length == 0 ? true : false;
    }
  },
  methods: {
    /**
     * 履歴ボタンが押下された
     */
    onClickHistory(contents) {
      this.dialogText = contents.htmlText;
      this.dialogRawText = contents.rawText;
      this.$refs.readFromHistory.showDialog();
    },
    /**
     * 削除ボタンが押下された
     */
    onClickDeleteButton() {
      this.$refs.deleteEditor.showDialog();
    },
    /**
     * 縦書ボタンが押下された
     */
    onClickTransposeEdit() {
      this.$refs.transposeEditor.showDialog();
    },
    /**
     * 顔文字ボタンが押下された
     */
    onClickEmotionButton() {
      //
      this.$refs.emojiEditor.showDialog();
    },
    /**
     * 原稿用紙にテキストを反映する
     */
    readTextToEditor() {
      this.$store.commit("setRawText", this.dialogRawText);
      this.tab = 0;
    },
    /**
     * 原稿用紙のテキストを削除する
     */
    deleteDraft() {
      this.$store.commit("setRawText", "");
    },
    /**
     * 縦書きを横書きに変換する
     */
    transposeText() {
      const original = this.$store.getters.rawText;
      const text = TextFormatter.transposeText(original);
      this.$store.commit("setRawText", text);
      // 履歴に登録する
      this.$store.commit("setHistory", {
        timestamp: Date.now(),
        date: `${new Date(Date.now()).toLocaleString()}`,
        text: original
      });
    },
    /**
     * 絵文字を原稿用紙に追加する
     */
    appendEmoji(code) {
      try {
        // 原稿用紙に直接追記を要求する
        this.$refs.genkoEditor[0].insertTextOnCursor(code.code);
      } catch {
        // 追記できないのなら後ろに登録する
        const original = this.$store.getters.rawText;
        this.$store.commit("setRawText", original + code.code);
      }
    }
  }
};
</script>

<style scoped>
.history-datetime {
  color: burlywood;
  width: 100%;
  text-align: right;
  padding-right: 0.5em;
}
</style>
