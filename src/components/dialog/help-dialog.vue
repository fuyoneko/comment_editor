<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 indigo darken-1 white--text">ヘルプ</v-card-title>

      <v-tabs v-model="tabIndex" background-color="transparent" grow>
        <v-tab href="#tab-1">概要</v-tab>
        <v-tab href="#tab-2">使い方</v-tab>
        <v-tab href="#tab-3">操作方法</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabIndex">
        <v-tab-item value="tab-1">
          <v-card-text>
            <div class="text-h6 content-subtitle">概要</div>
            <div>
              「放置少女」ゲーム内チャットの支援アプリです。
              <br />チャットに入力するテキストを自由に改行、または縦書きに変換することができます。
            </div>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">利点</div>
            <div>改行することで、見やすく整理された、分かりやすい情報を共有できます。</div>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">動作環境</div>
            <div>
              <v-chip class="ma-2">
                <v-icon>mdi-cellphone</v-icon>スマートフォン向けブラウザ
              </v-chip>
            </div>
            <div>
              <v-chip class="ma-2">
                <v-icon>mdi-tablet-android</v-icon>タブレット向けブラウザ
              </v-chip>
            </div>
            <div>
              <v-chip class="ma-2">
                <v-icon>mdi-laptop</v-icon>PC向けブラウザ
              </v-chip>
            </div>
            <div class="text-h6 content-subtitle">推奨環境</div>
            <div>
              <v-chip class="ma-2">
                <v-icon>mdi-apple-safari</v-icon>モバイルSafari
              </v-chip>
            </div>
            <div>
              <v-chip class="ma-2">
                <v-icon>mdi-google-chrome</v-icon>Chrome
              </v-chip>
            </div>
          </v-card-text>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-card-text>
            <div class="text-h6 content-subtitle">どう使うの？</div>
            <div>
              1. 原稿用紙にテキストを入力します
              <br />（※改行できます）
            </div>
            <div>
              <img width="90%" :src="baseUrl+'images/1_draft.png'" />
            </div>
            <div>2. 「COPYボタン」をタップして、クリップボードにコピーします</div>
            <div>
              <img width="30%" :src="baseUrl+'images/4_copy_button.png'" />
            </div>
            <div>3. 同盟チャットにペーストすると、入力したレイアウトのまま書き込みができます</div>
            <div>
              <img width="90%" :src="baseUrl+'images/3_display.png'" />
            </div>
            <div class="text-h6 content-subtitle">このアプリの機能</div>
            <div>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>改行の実現</v-list-item-title>
                  <v-list-item-subtitle>表示されない文字を入れることで、チャットで改行することができます。</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>横書きから縦書きへの変換</v-list-item-title>
                  <v-list-item-subtitle>横書きのテキストを転置して縦書きに変換できます。</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>履歴からの復元</v-list-item-title>
                  <v-list-item-subtitle>「COPYボタン」を押した時点のテキストを保持、再編集できます。</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>チャットのプレビュー</v-list-item-title>
                  <v-list-item-subtitle>チャットに書き込んだ時の見かけをあらかじめ確認できます。</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>チャットとの連携</v-list-item-title>
                  <v-list-item-subtitle>「COPYボタン」でチャットに連携することができます。</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-card-text>
          <v-card-text class="caption">
            <v-divider></v-divider>
            <div>※整形のためにユーロ記号（€）が挿入されますが、この文字は「放置少女」のチャットには表示されません。</div>
          </v-card-text>
        </v-tab-item>
        <v-tab-item value="tab-3">
          <v-card-text>
            <v-row justify="end">
              <v-col cols="auto">
                <span class="mr-6">画像サイズ</span>
                <v-btn-toggle v-model="imageSize" mandatory>
                  <v-btn small :value="0">標準</v-btn>
                  <v-btn small :value="1">拡大</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">テキストを編集する</div>
            <div>1. 「原稿用紙」欄を編集します（※1）</div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/1_draft.png'" />
            </div>
            <div>2. 入力できる文字数は原稿用紙の下に表示されます</div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/9_words_count_over.png'" />
            </div>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">見かけをプレビューする</div>
            <div>1. 「プレビュー」タブを押下します</div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/2_preview.png'" />
            </div>
            <div>2. チャットに投稿したときの見かけを確認できます</div>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">テキストをコピーする</div>
            <div>1. 右上の「COPYボタン」を押下します</div>
            <div>
              <img :width="displaySize(30, 60)" :src="baseUrl+'images/4_copy_button.png'" />
            </div>
            <div>2. 整形されたテキストがクリップボードにコピーされます</div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/help_snackbar.png'" />
            </div>
            <div>3. チャットで「ペースト」します</div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/help_paste.png'" />
            </div>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">原稿用紙のテキストを消す</div>
            <div>1. 「削除ボタン」を押下します</div>
            <div>
              <img :width="displaySize(30, 60)" :src="baseUrl+'images/5_delete_translate.png'" />
            </div>
            <div>2. 「原稿用紙」が最初の状態に戻ります</div>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">コピー履歴からテキストを復元する</div>
            <div>1. 「履歴」タブを押下します</div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/6_history.png'" />
            </div>
            <div>2. 吹き出しを押下することで、過去にコピーしたテキストを再編集できます</div>
          </v-card-text>
          <v-card-text>
            <div class="text-h6 content-subtitle">縦書きに変換する</div>
            <div>1. 「縦書ボタン」を押下します</div>
            <div>
              <img :width="displaySize(30, 60)" :src="baseUrl+'images/5_delete_translate.png'" />
            </div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/7_before_tate.png'" />
            </div>
            <div>
              <img :width="displaySize(70, 90)" :src="baseUrl+'images/8_translate.png'" />
            </div>
          </v-card-text>
          <v-card-text class="caption">
            <v-divider></v-divider>
            <div>※1：原稿用紙の改行位置と、チャットに投稿したときの改行位置は同じです</div>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog()">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      tabIndex: "tab-1",
      imageSize: 0
    };
  },
  computed: {
    /**
     * ベースURLを取得する
     */
    baseUrl() {
      const base = process.env.BASE_URL;
      if (base && base.length >= 1) {
        return base;
      }
      return "/";
    }
  },
  methods: {
    /**
     * ヘルプ画像のサイズを取得する
     */
    displaySize(valueA, valueB) {
      if (this.imageSize == 1) {
        return `${valueB}%`;
      }
      return `${valueA}%`;
    },
    closeDialog() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped>
.v-list-item__subtitle {
  white-space: normal !important;
}
.content-subtitle {
  color: rgb(49, 76, 77);
  border-bottom-color: cadetblue;
  border-bottom-style: solid;
  border-bottom-width: 2pt;
  margin-bottom: 12px;
  margin-top: 18px;
  width: 100%;
}
</style>
