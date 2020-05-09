import { DomListener } from "./DomListener";
import { Dom } from "./dom";
import { Type } from "../components/app/App";

export abstract class AppComponent extends DomListener {
  static className: string;

  public constructor(
    $root: Dom,
    options: {
      name?: string;
      listeners: (keyof HTMLElementEventMap)[];
    }
  ) {
    super($root, options.listeners || []);
    this.name = options.name || this.constructor.prototype.constructor.name;
    console.log("AppComponent -> this.name", this.name);
  }

  /**
   * returns html representation of the component
   */
  public toHTML(): string {
    throw new Error("Not implemented");
  }

  init() {
    this.initDOMListeners();
  }

  destroy() {
    this.removeDOMListeners();
  }
}
