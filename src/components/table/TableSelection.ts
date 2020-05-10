import { Dom } from "../../core/dom";

const selectedCellClass = "selected";

export class TableSelection {
  private group: Dom[] = [];

  select($el: Dom) {
    this.clear();
    $el.addClass(selectedCellClass);
    this.group.push($el);
  }

  private clear() {
    this.group.forEach(cell => cell.removeClass(selectedCellClass));
    this.group = [];
  }

  selectGroup() {}
}
