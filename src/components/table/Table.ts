import { AppComponent } from "../../core/AppComponent";
import { $, Dom } from "../../core/dom";
import { createTable } from "./table.template";
import { resizeHandler } from "./table.resize";

export class Table extends AppComponent {
  static className = "excel__table";

  constructor($root: Dom) {
    super($root, {
      listeners: ["mousedown", "click", "mouseup"]
    });
  }

  toHTML() {
    return createTable(100);
  }

  onMousedown(event: Event) {
    const resizeItem = (event.target as HTMLElement).dataset.resize as
      | "col"
      | "row";

    if (!resizeItem) {
      return;
    }
    resizeHandler(this.$root, resizeItem);
  }
}
