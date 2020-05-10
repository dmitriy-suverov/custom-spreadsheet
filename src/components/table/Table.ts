import { AppComponent } from "../../core/AppComponent";
import { $, Dom } from "../../core/dom";
import { createTable } from "./table.template";
import { resizeHandler } from "./table.resize";
import { TableSelection } from "./TableSelection";

const keysToProcess = [
  "Enter",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown"
] as const;

type SupportableKeys = typeof keysToProcess[number];

export class Table extends AppComponent {
  static className = "excel__table";
  selection: TableSelection;

  constructor($root: Dom) {
    super($root, {
      listeners: ["mousedown", "click", "keydown", "keypress"]
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

  onMousedown(event: MouseEvent) {
    const resizeItem = (event.target as HTMLElement).dataset.resize as
      | "col"
      | "row";

    if (!resizeItem) {
      return;
    }
    resizeHandler(this.$root, resizeItem);
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
    }
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

  // onKeypress(event: KeyboardEvent) {
  onKeydown(event: KeyboardEvent) {
    const key = event.key as SupportableKeys;
    console.log("Table -> onKeypress -> key", key);
    console.log("Table -> onKeydown -> event.shiftKey", event.shiftKey);
    if (keysToProcess.includes(key) && !event.shiftKey) {
      const $next = this.getNextCell(key, this.selection.current.coords);
      this.selection.select($next);
      event.preventDefault();
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
