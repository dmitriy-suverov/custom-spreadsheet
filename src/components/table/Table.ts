import { AppComponent } from "../../core/AppComponent";
import { $, Dom } from "../../core/dom";
import { createTable } from "./table.template";
import { resizeHandler } from "./table.resize";
import { TableSelection } from "./TableSelection";

export class Table extends AppComponent {
  static className = "excel__table";
  selection: TableSelection;

  constructor($root: Dom) {
    super($root, {
      listeners: ["mousedown", "click", "mouseup"]
    });
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selection.select($cell);
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

  onClick(event: Event) {
    if ((event.target as HTMLElement).dataset.type === "cell") {
      this.selection.select($(event.target as HTMLElement));
    }
  }
}
