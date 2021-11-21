import Emoji from "../model/emoji";

/**
 * 絵文字へのアクセサを取得する
 */
class EmojiAccessor {
  #emojiList = [];
  constructor(emojiList) {
    this.#emojiList = emojiList;
  }

  /**
   * 原稿用紙の表示コードから、該当する絵文字を取得する
   * 該当する絵文字がない場合は最初に割り当てた絵文字を返却する
   * @param {表示コード} editorCode
   */
  getFromEditorCode(editorCode) {
    try {
      return this.#emojiList.filter((item) => item.editorCode == editorCode)[0];
    } catch {
      return this.#emojiList[0];
    }
  }

  /**
   * 原稿用紙の編集中文字列を、絵文字のあるHTMLプレビューテキストに変換する
   * @param {原稿用紙の編集中文字列} originalText
   */
  convertToPreviewText(originalText) {
    const regex = /\$\{(?<key>[0-9A-Za-z])\}/g;
    if (regex.test(originalText)) {
      return originalText.replace(regex, (_, key) => {
        return this.getFromEditorCode(key).html;
      });
    }
    return originalText;
  }

  /**
   * 原稿用紙の編集中文字列を、連携先で使うコピー文字列に変換する
   * @param {原稿用紙の編集中文字列} originalText
   */
  convertToCopyText(originalText) {
    const regex = /\$\{(?<key>[0-9A-Za-z])\}/g;
    if (regex.test(originalText)) {
      return originalText.replace(regex, (_, key) => {
        return this.getFromEditorCode(key).export;
      });
    }
    return originalText;
  }

  /**
   * 絵文字の一覧を取得する
   */
  get emoji() {
    return this.#emojiList;
  }
}

export default new EmojiAccessor([
  // --------------
  // 1段目
  // --------------
  //ショックを受ける
  new Emoji({
    "display-code": "img1",
    "editor-code": "1",
    "export-code": "/1/",
  }),
  //うそぶく
  new Emoji({
    "display-code": "img2",
    "editor-code": "2",
    "export-code": "/2/",
  }),
  //口ごもる
  new Emoji({
    "display-code": "img3",
    "editor-code": "3",
    "export-code": "/3/",
  }),
  //わからない
  new Emoji({
    "display-code": "img4",
    "editor-code": "4",
    "export-code": "/4/",
  }),
  //嬉しい
  new Emoji({
    "display-code": "img5",
    "editor-code": "5",
    "export-code": "/5/",
  }),
  //しらんけど
  new Emoji({
    "display-code": "img6",
    "editor-code": "6",
    "export-code": "/6/",
  }),
  //おこる
  new Emoji({
    "display-code": "img7",
    "editor-code": "7",
    "export-code": "/7/",
  }),
  // --------------
  // 2段目
  // --------------
  //ぎくり
  new Emoji({
    "display-code": "img8",
    "editor-code": "8",
    "export-code": "/8/",
  }),
  //ぴえん
  new Emoji({
    "display-code": "img9",
    "editor-code": "9",
    "export-code": "/9/",
  }),
  //了解
  new Emoji({
    "display-code": "img10",
    "editor-code": "A",
    "export-code": "/10/",
  }),
  //にやにや
  new Emoji({
    "display-code": "img11",
    "editor-code": "B",
    "export-code": "/11/",
  }),
  //冷や汗
  new Emoji({
    "display-code": "img12",
    "editor-code": "C",
    "export-code": "/12/",
  }),
  //ハート
  new Emoji({
    "display-code": "img13",
    "editor-code": "D",
    "export-code": "/13/",
  }),
  //唇を尖らせる
  new Emoji({
    "display-code": "img14",
    "editor-code": "E",
    "export-code": "/14/",
  }),
  // --------------
  // 3段目
  // --------------
  //興奮
  new Emoji({
    "display-code": "img15",
    "editor-code": "F",
    "export-code": "/15/",
  }),
  //青ざめる
  new Emoji({
    "display-code": "img16",
    "editor-code": "G",
    "export-code": "/16/",
  }),
  //泣く
  new Emoji({
    "display-code": "img17",
    "editor-code": "H",
    "export-code": "/17/",
  }),
  //サムズアップ
  new Emoji({
    "display-code": "img18",
    "editor-code": "I",
    "export-code": "/18/",
  }),
  //ケーキ
  new Emoji({
    "display-code": "img19",
    "editor-code": "J",
    "export-code": "/19/",
  }),
  //シャウト
  new Emoji({
    "display-code": "img20",
    "editor-code": "K",
    "export-code": "/20/",
  }),
]);
