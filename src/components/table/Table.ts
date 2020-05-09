import { AppComponent } from "../../core/AppComponent";
import { Dom } from "../../core/dom";
import { createTable } from "./table.template";

export class Table extends AppComponent {
  static className = "excel__table";

  constructor($root: Dom) {
    super($root, {
      listeners: ["input", "click"]
    });
  }

  toHTML() {
    return createTable(100);
  }
}
