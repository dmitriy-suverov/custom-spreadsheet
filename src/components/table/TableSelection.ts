import { Dom } from "../../core/dom";

const selectedCellClass = "selected";

export class TableSelection {
  private group: Dom[] = [];
  public current: Dom | null = null;

  get selectedIds() {
    return this.group.map(cell => cell.id);
  }

  public select($el: Dom) {
    this.clear();
    $el.focus();
    $el.addClass(selectedCellClass);
    this.group.push($el);
    this.current = $el;
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

  public applyStyle(newStyle: { [key in keyof CSSStyleDeclaration]: string }) {
    this.group.forEach(el => el.css(newStyle));
  }
}
