import Character from "./character";

/**
 * 行を管理するコンテナクラス
 */
class Line {
  #line = "";
  #characterMaxLength = 0;

  /**
   * コンストラクタ
   * @param {入力パラメータ} parameter
   */
  constructor(parameter = {}) {
    this.#line = parameter["line"] || "";
    this.#characterMaxLength = parameter["character-max-length"] || 15;
  }

  /**
   * Private
   * 文字を行末に追加する
   * @param {Characterクラスの文字} character
   */
  #appendCharacter(character) {
    this.#line = this.#line + character.value;
  }

  /**
   * テキストを行末に追加する
   * @param {stringクラスのテキスト} text
   * @return remain 長さの制限で追加できなかった余りのテキスト
   */
  trySetAndGetRemain(text) {
    // テキストを文字に分解して行末に追加する
    for (let i = 0; i < text.length; i += 1) {
      // 最大文字数を超えていれば、以降を余りとして返す
      if (!this.isAppendable) {
        return text.substr(i);
      }
      // 文字をコンテナに入れる
      const character = new Character({
        text: text,
        "from-index": i,
      });
      // 改行文字であれば処理を止めて、改行以降を余りとして返す
      if (character.isNewLine) {
        return text.substr(i + 1);
      }
      // テキストの末尾に文字を追加する
      this.#appendCharacter(character);
    }
    return "";
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
      "character-max-length": this.#characterMaxLength,
    });
    /* 文字列長が奇数であれば、全角文字の位置がそろうよう、1バイトのスペースを入れる */
    if (this.length % 2 == 1) {
      line.#appendCharacter(new Character(" "));
    }
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
   * 文字を追加できるのならTrueを返す
   */
  get isAppendable() {
    // 行に格納できる最大の文字長さを取得する
    const asciiMaxLength = this.#characterMaxLength * 2;
    if (this.length >= asciiMaxLength) {
      return false;
    }
    return true;
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
