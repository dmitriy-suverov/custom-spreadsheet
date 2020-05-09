export class Dom {
  public $el: HTMLElement;
  public constructor(selector: string | HTMLElement) {
    this.$el =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
  }

  public html(html: string | undefined) {
    if (typeof html === "string") {
      this.$el.innerHTML = html;
      return this;
    }
    return this.$el.outerHTML.trim();
  }

  public clear() {
    this.html("");
    return this;
  }

  public on(eventType: keyof HTMLElementEventMap, callback: (event) => any) {
    this.$el.addEventListener(eventType, callback);
  }

  public off( 
    eventType: keyof HTMLElementEventMap,
    callback: (event) => any
  ) {
    console.log("Dom -> eventType, callback", eventType, callback);
    this.$el.removeEventListener(eventType, callback);
  }

  public append(node: Dom | HTMLElement) {
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
