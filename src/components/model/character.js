/*
    パラメータを条件に合うパーサで初期化する
*/
const INPUT_PARAMETER_FACTRIES = [
  /* 
    テキストで初期化する 
    使い方：new Character("A")
    */
  {
    condition: (p) => {
      return typeof p == "string" ? true : false;
    },
    factory: (p) => {
      return p;
    },
  },
  /* 
    文字列の末尾で初期化する 
    使い方：new Character({text: "text", "last-string": true})
    */
  {
    condition: (p) => {
      if (typeof p == "string") return false;
      if (!("text" in p)) return false;
      if (!("last-string" in p)) return false;
      return true;
    },
    factory: (p) => {
      const text = p["text"];
      return text.substr(text.length - 1, 1);
    },
  },
  /* 
    文字列と位置から初期化する 
    使い方：new Character({text: "text", "from-index": 2})
    */
  {
    condition: (p) => {
      if (typeof p == "string") return false;
      if (!("text" in p)) return false;
      if (!("from-index" in p)) return false;
      return true;
    },
    factory: (p) => {
      const text = p["text"];
      const index = p["from-index"];
      return text.substr(index, 1);
    },
  },
];

/**
 * 文字のコンテナクラス
 */
class Character {
  #character = "";

  /**
   * コンストラクタ
   * @param {初期化パラメータ} parameter
   */
  constructor(parameter) {
    try {
      // 条件に合う変換関数を取得する
      let factory = INPUT_PARAMETER_FACTRIES.filter((f) =>
        f.condition(parameter)
      ).map((f) => f.factory);
      // 条件に合う変換関数があれば、入力パラメータを適用する
      if (factory.length >= 1) {
        this.#character = factory[0](parameter);
      } else {
        this.#character = "";
      }
    } catch {
      this.#character = "";
    }
  }

  /**
   * Public
   * 文字列の処理上の長さを取得する
   * 全角：2
   * 半角：1
   */
  get length() {
    if (this.isEmpty) {
      return 0;
    }
    if (this.isAscii) {
      return 1;
    }
    return 2;
  }

  /**
   * もしnullまたは空文字であればTrue、そうでなければfalseを返す
   */
  get isEmpty() {
    return (this.#character || "") == "" ? true : false;
  }

  /**
   * 1バイト文字であればTrue、そうでなければFalseを返す
   */
  get isAscii() {
    if (this.isEmpty) return false;
    return this.#character.charCodeAt(0) <= 127 ? true : false;
  }

  /**
   * マルチバイト文字であればTrue、そうでなければFalseを返す
   */
  get isUnicode() {
    if (this.isEmpty) return false;
    return !this.isAscii;
  }

  /**
   * 改行文字であればTrue、そうでなければFalseを返す
   */
  get isNewLine() {
    return this.#character == "\n" ? true : false;
  }

  /**
   * 格納されている文字を返す
   */
  get value() {
    return this.#character;
  }
}

export default Character;
