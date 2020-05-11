import { $, Dom } from "./dom";
import { getMethodName } from "./utils";

export class DomListener {
  protected name: string;

  constructor(protected readonly $root: Dom, private readonly listeners = []) {
    if (!$root) {
      throw new Error("$root is not provided");
    }
  }

  protected initDOMListeners() {
    this.listeners.forEach(listener => {
      const methodName = getMethodName(listener);
      if (!this[methodName]) {
        // console.error(
        //   `Method ${methodName} is not implemented in ${this.name || ""}`
        // );
        return;
      }
      this[methodName] = this[methodName].bind(this);
      this.$root.on(listener, this[methodName]);
    });
  }

  protected removeDOMListeners() {
    this.listeners.forEach(listener => {
      const methodName = getMethodName(listener);
      if (!this[methodName]) {
        console.error(
          `Method ${methodName} is not implemented in ${this.name || ""}`
        );
        return;
      }
      this.$root.off(listener, this[methodName]);
    });
  }
}
