import { AppComponent, AppComponentOptions } from "../../core/AppComponent";
import { $, Dom } from "../../core/dom";
import { createTable } from "./table.template";
import { resizeHandler } from "./table.resize";
import { TableSelection } from "./TableSelection";
import { resizeAction, changeTextAction } from "./table.actions";

const keysToProcess = [
  "Enter",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown"
] as const;

export type TABLE_EVENTS = "table:select" | "table:input";
type SupportableKeys = typeof keysToProcess[number];

export class Table extends AppComponent {
  static className = "excel__table";
  selection: TableSelection;

  constructor($root: Dom, options: AppComponentOptions) {
    super($root, {
      listeners: ["mousedown", "click", "keydown", "keypress", "input"],
      ...options
    });
  }

  public onBeforeInit() {
    this.selection = new TableSelection();
  }

  public init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);

    this.on("formula:input", text => this.selection.current.text(text));
    this.on("formula:end-of-input", () => {
      this.selection.current.focus();
      function moveCursorToEnd(el) {
        if (typeof el.selectionStart == "number") {
          el.selectionStart = el.selectionEnd = el.value.length;
        } else if (typeof el.createTextRange != "undefined") {
          el.focus();
          const range = el.createTextRange();
          range.collapse(false);
          range.select();
        }
      }
      moveCursorToEnd(this.selection.current.$el);
    });
  }

  private async resizeTable(event, resizeItem: "col" | "row") {
    const data = await resizeHandler(this.$root, resizeItem);
    this.dispatch(resizeAction(data));
  }

  selectCell($cell: Dom) {
    this.selection.select($cell);
    this.emit("table:select", $cell.text());
  }

  toHTML() {
    return createTable(100, this.store.getState());
  }

  async onMousedown(event: MouseEvent) {
    const resizeItem = (event.target as HTMLElement).dataset.resize as
      | "col"
      | "row";

    if (!resizeItem) {
      return;
    }
    await this.resizeTable(this.$root, resizeItem);
  }

  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.dataset.type !== "cell") {
      return;
    }
    const $targetCell = $(target);
    if (this.isMultipleSelection(event)) {
      const $cells = this.getCellsToSelect($targetCell);
      this.selection.selectGroup($cells);
    } else {
      this.selection.select($targetCell);
      this.emit("table:select", this.selection.current.text());
    }
  }

  onInput(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    this.emit("table:input", target.textContent);
    this.dispatch(changeTextAction({[target.dataset.id]: target.innerText}))
  }

  private getCellsToSelect($targetCell: Dom) {
    const startCoords = this.selection.current.coords;
    const endCoords = $targetCell.coords;
    const cols = range(startCoords.col, endCoords.col);
    const rows = range(startCoords.row, endCoords.row);
    const ids = [];
    cols.forEach(col => {
      rows.forEach(row => ids.push(`${col}:${row}`));
    }, []);
    const $cells = ids.map(id => this.$root.find(`[data-id="${id}"]`));
    return $cells;
  }

  private isMultipleSelection(event: MouseEvent) {
    return event.shiftKey;
  }

  onKeydown(event: KeyboardEvent) {
    const key = event.key as SupportableKeys;
    if (keysToProcess.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const $next = this.getNextCell(key, this.selection.current.coords);
      this.selectCell($next);
    }
  }

  private getNextCell(
    key: SupportableKeys,
    { col, row }: { col: number; row: number }
  ): Dom {
    switch (key) {
      case "ArrowDown":
      case "Enter":
        row++;
        break;
      case "ArrowRight":
      case "Tab":
        col++;
        break;
      case "ArrowLeft":
        if (col > 0) {
          col--;
        }
        break;
      case "ArrowUp":
        if (row > 0) {
          row--;
        }
        break;
    }

    return this.$root.find(`[data-id="${col}:${row}"`);
  }
}

function range(start: number, end: number): number[] {
  if (start > end) {
    [start, end] = [end, start];
  }
  return new Array(end - start + 1).fill("").map((_, idx) => start + idx);
}
