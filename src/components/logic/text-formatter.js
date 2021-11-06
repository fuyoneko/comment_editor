import Line from "../model/line";

class TextFormatterClass {
  getLength(text) {
    const data = this.parseToCopyText(text, "あ");
    return data.length;
  }

  /**
   * Private
   * テキストデータを行配列に変換する
   * @param {変換元のテキストデータ} text
   */
  #parseToLines(text) {
    let parseText = text;
    let result = [];
    let isContinue = true;
    while (isContinue) {
      let line = new Line();
      parseText = line.trySetAndGetRemain(parseText);
      isContinue = (parseText || "").length != 0 ? true : false;
      result.push(line);
    }
    return result;
  }

  /**
   * テキストデータをコピー用形式に変換する
   * @param {変換元のテキストデータ} text
   * @param {末尾を埋める文字} fillCharacter
   */
  parseToCopyText(text, fillCharacter) {
    return this.#parseToLines(text)
      .map((line, index, array) => {
        if (index == array.length - 1) {
          return line.getRawText();
        }
        return line.getFilledText(fillCharacter);
      })
      .join("");
  }

  /**
   * テキストデータをHTMLプレビュー用のテキストに変換する
   * @param {変換元のテキストデータ} text
   */
  parseToPreviewText(text) {
    return this.#parseToLines(text)
      .map((line) => line.getPreviewText())
      .join("");
  }

  /**
   * 横書きから縦書きに転置できるのならTrueを返す
   * @param {対象テキスト} text
   */
  canTransposeText(text) {
    if (text.length == 0) return false;
    // 7行以上であれば変換不可とする
    const lines = text.split("\n");
    if (lines.length > 7) return false;
    return lines.every((line) => {
      // 7文字以上であれば変換不可とする
      if (line.length > 7) return false;
      // 半角英数字が含まれていれば変換不可とする
      if (new RegExp(/[a-zA-Z0-9]+/).test(line)) return false;
      return true;
    });
  }

  /**
   * 横書きから縦書きに転置する
   * @param {対象テキスト} text
   */
  transposeText(text) {
    if (this.canTransposeText(text)) {
      // 変換対象のテキスト
      const targetText = text.split("\n");
      // 2次元配列の転置
      const transpose = (a) => a[0].map((_, c) => a.map((r) => r[c]));
      // 文字列を文字の配列に変換する
      const stringToCharList = (text) => {
        let result = [];
        for (let i = 0; i < text.length; i++) {
          result.push(text[i]);
        }
        return result;
      };
      // 各行の最大文字数を取得する
      const maxXLength = Math.max(...targetText.map((line) => line.length));
      // 横書きを縦書きに変換する
      return (
        transpose(
          targetText.map((line) => {
            const filledLine = line + "　　　　　　　";
            return stringToCharList(filledLine.substring(0, maxXLength));
          })
        )
          // 並び順を逆転、文字の配列を文字列に変換する
          .map((line) => line.reverse().join(""))
          // 行の配列をテキストに変換する
          .join("\n")
          // 音引を縦棒に変換する
          .replace(/ー/g, "｜")
      );
    }
    return text;
  }
}

export default new TextFormatterClass();
