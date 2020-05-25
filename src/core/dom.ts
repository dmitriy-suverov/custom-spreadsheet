export class Dom {
  public $el: HTMLElement;
  public constructor(selector: string | HTMLElement) {
    this.$el =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
  }

  // todo get-set
  public html(html?: string | undefined): this | string {
    if (typeof html === "string") {
      this.$el.innerHTML = html;
      return this;
    }
    return this.$el.outerHTML.trim();
  }

  public text(text: string | undefined = undefined): this | string {
    if (["string", "number"].includes(typeof text)) {
      if (this.$el.tagName.toLowerCase() === "input") {
        (this.$el as HTMLInputElement).value = text;
      } else {
        this.$el.textContent = text;
      }
      return this;
    }

    if (this.$el.tagName.toLowerCase() === "input") {
      return (this.$el as HTMLInputElement).value.trim();
    }

    return this.$el.textContent.trim();
  }

  public clear(): this {
    this.html("");
    return this;
  }

  public on(
    eventType: keyof HTMLElementEventMap,
    callback: (event) => any
  ): void {
    this.$el.addEventListener(eventType, callback);
  }

  public off(
    eventType: keyof HTMLElementEventMap,
    callback: (event) => any
  ): void {
    this.$el.removeEventListener(eventType, callback);
  }

  public append(node: Dom | HTMLElement): this {
    if (node instanceof Dom) {
      node = node.$el;
    }

    if (Element.prototype.append) {
      this.$el.append(node);
    } else {
      this.$el.appendChild(node);
    }

    return this;
  }

  public closest(selector: string): Dom {
    return $(this.$el.closest(selector) as HTMLElement);
  }

  public getCoords(): ReturnType<HTMLElement["getBoundingClientRect"]> {
    return this.$el.getBoundingClientRect();
  }

  public find(selector: string) {
    return $(this.$el.querySelector(selector) as HTMLElement);
  }

  public findAll(selector: string) {
    return this.$el.querySelectorAll(selector);
  }

  public css(
    styles: Partial<Record<keyof CSSStyleDeclaration, string | number | null>>
  ) {
    Object.keys(styles).forEach(key => {
      this.$el.style[key] = styles[key];
    });
  }

  public addClass(className: string): void {
    this.$el.classList.add(className);
  }

  public removeClass(className: string): void {
    this.$el.classList.remove(className);
  }

  public focus() {
    this.$el.focus();
    return this;
  }

  public blur() {
    this.$el.blur();
    return this;
  }

  public getStyles(
    styles: (keyof CSSStyleDeclaration)[] = []
  ): Record<keyof CSSStyleDeclaration, any> {
    const result = {} as any;
    styles.forEach(style => {
      result[style] = this.$el.style[style];
    });

    return result;
  }

  public getAttr(name: string) {
    return this.$el.getAttribute(name);
  }

  public setAttr(name: string, value: string) {
    this.$el.setAttribute(name, value);
    return this;
  }

  /**
   * Table cell identifier
   */
  get id(): string {
    return this.$el.dataset.id;
  }

  get data() {
    return this.$el.dataset;
  }

  get coords(): { col: number; row: number } {
    const id = this.id;
    const [row, col] = id.split(":").map(val => +val);
    console.log("Dom -> getcoords -> [row, col]", id, [row, col]);
    return {
      col,
      row
    };
  }
}

// event.target
export const $ = (selector: string | HTMLElement) => {
  return new Dom(selector);
};

$.create = (tagName: keyof HTMLElementTagNameMap, classes: string = "") => {
  const el: HTMLElement = document.createElement(tagName);
  if (classes) {
    el.classList.add(classes);
  }
  return $(el);
};
