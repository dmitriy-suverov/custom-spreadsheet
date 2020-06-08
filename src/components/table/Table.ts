import { AppComponent, AppComponentOptions } from "../../core/base-components/app.component";
import { $, Dom } from "../../core/dom";
import { createTable, getCellId } from "./table.template";
import { resizeHandler } from "./table.resize";
import { TableSelection } from "./TableSelection";
import { resizeAction, changeTextAction } from "./table.actions";
import { DEFAULT_STYLES } from "../../constants";
import { currentStylesAction, applyStyleAction } from "../../redux/actions";
import { CellParser } from "../../core/CellParser";

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
  private selection: TableSelection;
  private cellInput: string = "";

  constructor($root: Dom, options: AppComponentOptions) {
    super($root, {
      listeners: ["mousedown", "click", "keydown", "keypress", "input"],
      subscribeToStoreFields: ["cellData"],
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

    this.on("formula:input", (text: string) => {
      this.selection.current
        .setAttr("data-value", text)
        .text(CellParser.parse(text));
    });
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

    this.on("toolbar:applyStyle", style => {
      this.selection.applyStyle(style);
      this.dispatch(applyStyleAction(this.selection.selectedIds, style));
    });
  }

  private async resizeTable(event, resizeItem: "col" | "row") {
    const data = await resizeHandler(this.$root, resizeItem);
    this.dispatch(resizeAction(data));
  }

  selectCell($cell: Dom) {
    this.selection.select($cell);
    this.emit("table:select", $cell);
    this.dispatch(
      currentStylesAction(
        $cell.getStyles(
          Object.keys(DEFAULT_STYLES) as (keyof CSSStyleDeclaration)[]
        )
      )
    );
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
    // todo wrap to function Cell::update-data-value
    if (this.cellInput != "") {
      this.dispatch(
        changeTextAction({ [this.selection.current.id]: this.cellInput })
      );
      this.cellInput = "";
    }

    const $targetCell = $(target);
    if (this.isMultipleSelection(event)) {
      const $cells = this.getCellsToSelect($targetCell);
      this.selection.selectGroup($cells);
    } else {
      this.selectCell($targetCell);
    }
  }

  onInput(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    console.log("Table -> onInput -> target", target.textContent);
    this.emit("table:input", target.textContent);
    this.cellInput = target.textContent;
  }

  private getCellsToSelect($targetCell: Dom) {
    const startCoords = this.selection.current.coords;
    const endCoords = $targetCell.coords;
    const cols = range(startCoords.col, endCoords.col);
    const rows = range(startCoords.row, endCoords.row);
    const ids = [];
    cols.forEach(col => {
      rows.forEach(row => ids.push(getCellId(row, col)));
    }, []);
    const $cells = ids.map(id => this.$root.find(`[data-id="${id}"]`));
    return $cells;
  }

  private isMultipleSelection(event: MouseEvent) {
    return event.shiftKey;
  }

  onKeydown(event: KeyboardEvent) {
    const key = event.key as SupportableKeys;
    if (key === "Enter" && this.cellInput !== "") {
      console.log("Table -> onKeydown -> key ==='Enter'", key === "Enter");
      this.dispatch(
        changeTextAction({ [this.selection.current.id]: this.cellInput })
      );
      this.cellInput = "";
    }
    if (keysToProcess.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const $next = this.getNextCell(key, this.selection.current.coords);
      this.selectCell($next);
    }
  }

  private getNextCell(
    key: SupportableKeys,
    { col: colIdx, row: rowIdx }: { col: number; row: number }
  ): Dom {
    switch (key) {
      case "ArrowDown":
      case "Enter": {
        rowIdx++;
        break;
      }

      case "ArrowRight":
      case "Tab":
        colIdx++;
        break;
      case "ArrowLeft":
        if (colIdx > 0) {
          colIdx--;
        }
        break;
      case "ArrowUp":
        if (rowIdx > 0) {
          rowIdx--;
        }
        break;
    }

    return this.$root.find(`[data-id="${getCellId(rowIdx, colIdx)}"`);
  }

  storeChanged() {
    this.$root.html(this.toHTML());
  }
}

function range(start: number, end: number): number[] {
  if (start > end) {
    [start, end] = [end, start];
  }
  return new Array(end - start + 1).fill("").map((_, idx) => start + idx);
}
