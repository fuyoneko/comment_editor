/**
 * 絵文字を管理する
 * Emoji({
 *  "editor-code": "エディタ上の表示名",
 *  "display-code": "画像ファイル名",
 *  "export-code": "コピー先アプリ上の表示名"
 * })
 */
class Emoji {
  #editorCode = "";
  #displayCode = "";
  #exportCode = "";

  /**
   * コンストラクタ
   * @param {初期化パラメータ} parameter
   */
  constructor(parameter) {
    this.#editorCode = parameter["editor-code"] || "";
    this.#displayCode = parameter["display-code"] || "";
    this.#exportCode = parameter["export-code"] || "";
  }

  /**
   * 絵文字の画像URLを取得する
   */
  get imageUrl() {
    return this.#baseUrl + "images/emoji/" + this.#displayCode + ".png";
  }

  /**
   * 絵文字の画像URLをインライン部品に変換する
   */
  get html() {
    return `<span style = "display:inline-block; text-align: center; width: 2em"><img style="transform: translateY(4px)" src="${this.imageUrl}" width="24" /></span>`;
  }

  /**
   * 絵文字コードを原稿用紙内の表示文字列（${n}）に変換する
   */
  get code() {
    return `$\{${this.#editorCode}}`;
  }

  /**
   * 絵文字コードを返却する
   */
  get editorCode() {
    return this.#editorCode;
  }

  /**
   * 連携先アプリの表示文字列に変換する
   */
  get export() {
    return this.#exportCode;
  }

  /**
   * 画像リソースの参照先パスを取得する
   */
  get #baseUrl() {
    try {
      const base = process.env.BASE_URL;
      if (base && base.length >= 1) {
        return base;
      }
      return "/";
    } catch {
      return "/";
    }
  }
}

export default Emoji;
