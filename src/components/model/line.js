import Character from "./character";

/**
 * 行を管理するコンテナクラス
 */
class Line {
  #line = "";
  #lastCharacter = null;
  #characterMaxLength = 0;

  /**
   * コンストラクタ
   * @param {入力パラメータ} parameter
   */
  constructor(parameter = {}) {
    this.#line = parameter["line"] || "";
    this.#lastCharacter = parameter["last-character"] || null;
    this.#characterMaxLength = parameter["character-max-length"] || 15;
  }

  /**
   * Private
   * 文字を行末に追加する
   * @param {Characterクラスの文字} character
   */
  #appendCharacter(character) {
    this.#line = this.#line + character.value;
    this.#lastCharacter = character;
  }

  /**
   * テキストを行末に追加する
   * @param {stringクラスのテキスト} text
   * @return remain 長さの制限で追加できなかった余りのテキスト
   */
  trySetAndGetRemain(text) {
    // 行に格納できる最大の文字長さを取得する
    const asciiMaxLength = this.#characterMaxLength * 2;
    if (this.length >= asciiMaxLength) {
      // 文字長さが最大を超えていれば処理せず、全て余りとして返す
      return text;
    }
    // テキストを文字に分解して行末に追加する
    let remain = "";
    for (let i = 0; i < text.length; i += 1) {
      // 文字をコンテナに入れる
      const character = new Character({
        text: text,
        "from-index": i,
      });
      // 改行文字であれば処理を止めて、改行以降を余りとして返す
      if (character.isNewLine) {
        return text.substr(i + 1);
      }
      // この文字がマルチバイト、直前が1バイト半角であれば文字埋めを行う
      if (character.isUnicode && this.#lastCharacter?.isAscii) {
        // 全角文字の位置がそろうよう、1バイトのスペースを入れる
        if (this.length % 2 == 1) {
          this.#appendCharacter(new Character(" "));
          if (this.length >= asciiMaxLength) {
            // 最大文字数を超えていれば、以降を余りとして返す
            return text.substr(i);
          }
        }
      }
      // テキストの末尾に文字を追加する
      this.#appendCharacter(character);
      if (this.length >= asciiMaxLength) {
        // 最大文字数を超えていれば、以降を余りとして返す
        return text.substr(i + 1);
      }
    }
    return remain;
  }

  /**
   * 入力のままのテキストを返す
   */
  getRawText() {
    return this.#line;
  }

  /**
   * コピー用のテキストを返す
   * @param {改行を埋める文字} fillCharacter
   */
  getFilledText(fillCharacter) {
    /* n文字分連続するfillCharacterを作成する */
    const createFilledText = (length, character) => {
      let text = "";
      for (let index = 0; index < length; index++) {
        text += character;
      }
      return text;
    };
    /* 行データをコピーする */
    let line = new Line({
      line: this.#line,
      "last-character": new Character({
        text: this.#line,
        "last-string": true,
      }),
      "character-max-length": this.#characterMaxLength,
    });
    /* コピーしたデータの行末にfillCharacterを追加する */
    line.trySetAndGetRemain(
      createFilledText(this.#characterMaxLength, fillCharacter)
    );
    /* 末尾をfillCharacterで埋めたテキストを返す */
    return line.getRawText();
  }

  /**
   * HTMLプレビュー用のテキストを返す
   */
  getPreviewText() {
    return this.#line.replace(/ /g, "&nbsp;") + "<br />";
  }

  /**
   * テキストの長さを返す
   */
  get length() {
    let totalLength = 0;
    for (let i = 0; i < this.#line.length; i += 1) {
      const character = new Character({
        text: this.#line,
        "from-index": i,
      });
      totalLength += character.length;
    }
    return totalLength;
  }
}

export default Line;
