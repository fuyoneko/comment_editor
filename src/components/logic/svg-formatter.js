/**
 * SVG画像コンテンツを管理するクラス
 */
class SvgFormatter {
  #data = [];
  #x = "";
  #y = "";
  #width = "";
  #height = "";

  /**
   * コンストラクタ
   *
   * @param {画像の幅} width
   * @param {画像の高さ} height
   */
  constructor(width, height) {
    this.#data = [];
    this.#x = "0";
    this.#y = "0";
    this.#width = width;
    this.#height = height;
  }

  /**
   * Public
   * 画像に形を追加する
   *
   * @param {形の名前、例：rect、circle} shape
   * @param {形のパラメータ} parameters
   */
  append(shape, parameters) {
    let parameter = Object.keys(parameters)
      .map((key) => `${key}="${parameters[key]}"`)
      .join(" ");
    this.#data.push(`<${shape} ${parameter}></${shape}>`);
  }

  /**
   * Private
   * SVGデータを作成する
   */
  #createSvgData() {
    let drawData = [];
    drawData.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${this.viewBox}">`
    );
    drawData.push(...this.#data);
    drawData.push("</svg>");
    return drawData.join("");
  }

  /**
   * Public
   * URL形式でデータを取得する
   */
  get url() {
    let svg = encodeURI(this.#createSvgData());
    return `url("data:image/svg+xml;charset=utf8,${svg}")`;
  }

  /**
   * Public
   * 画像サイズをSVGのパラメータ形式で取得する
   */
  get viewBox() {
    return [this.#x, this.#y, this.#width, this.#height]
      .map((p) => `${p}`)
      .join(" ");
  }
}

export default SvgFormatter;
