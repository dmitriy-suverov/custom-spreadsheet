import { Dom } from "../../core/dom";

const selectedCellClass = "selected";

export class TableSelection {
  private group: Dom[] = [];
  private _current: Dom | null = null;

  public select($el: Dom) {
    this.clear();
    $el.focus()
    $el.addClass(selectedCellClass);
    this.group.push($el);
    this._current = $el;
  }

  private clear() {
    this.group.forEach(cell => cell.removeClass(selectedCellClass));
    this.group = [];
  }

  public selectGroup($cells: Dom[]) {
    this.clear();
    this.group = $cells;
    this.group.forEach($el => $el.addClass(selectedCellClass));
  }

  get current() {
    return this._current;
  }
}
