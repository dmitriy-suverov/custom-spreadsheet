import { DomListener } from "./DomListener";

export class ExcelComponent extends DomListener {
  constructor($root) {
    super($root);
  }

  /**
   * returns html representation of the component
   * @return {string}
   */
  toHTML () {
    throw new Error("Not implemented");
  }
}
