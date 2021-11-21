<template>
  <v-overlay absolute :value="dialog">
    <v-card style="width: 320px">
      <v-card-text>
        <v-row align="center" justify="space-between">
          <v-col cols="auto">
            <div class="white--text">絵文字を選択してください</div>
            <div class="text-caption">（左側の×ボタンで閉じる）</div>
          </v-col>
          <v-col cols="auto">
            <v-btn icon color="white" @click="hideDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              outlined
              max-width="40"
              min-width="40"
              color="white"
              v-for="item in emoji"
              :key="item.key"
              @click="onClickedEmoji($event, item)"
            >
              <img :src="item.imageUrl" width="24" />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
import Emoji from "../logic/emoji-defines";

export default {
  data() {
    return {
      dialog: false,
      emoji: Emoji.emoji
    };
  },
  methods: {
    /**
     * ダイアログを表示する
     */
    showDialog() {
      this.dialog = true;
    },
    /**
     * ダイアログを閉じる
     */
    hideDialog() {
      this.dialog = false;
    },
    /**
     * 絵文字のいずれかが押下された
     */
    onClickedEmoji(e, code) {
      this.$emit("on-clicked-emoji", code);
      this.dialog = false;
    }
  }
};
</script>

<style>
</style>