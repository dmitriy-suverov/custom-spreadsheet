import { AppState } from "../../core/store/Store";
import { DEFAULT_STYLES } from "../../constants";
import { camelToDashCase } from "../../core/utils";
import { CellParser } from "../../core/CellParser";

const codes = {
  A: 65,
  Z: 90
};

function createCell(colIdx: number, rowIdx: number, state: AppState): string {
  const cellId = getCellId(rowIdx, colIdx);
  const cellStyles = state.stylesState[cellId] || {};
  const stylesArr = Object.keys(DEFAULT_STYLES).map(
    key => `${camelToDashCase(key)}:${cellStyles[key] || DEFAULT_STYLES[key]};`
  );
  const content = getCellContentFromState(state.cellData, cellId);

  const width = getWidthInPx(state.sizes.colState, colIdx);
  if (width) {
    stylesArr.push(`width:${width};`);
  }

  return `
    <div class="cell"
    contenteditable="" 
    data-col="${colIdx}" 
    data-type="cell"
    data-id="${getCellId(rowIdx, colIdx)}"
    data-value="${content}"
    style="${stylesArr.join("")}"
    >
     ${CellParser.parse(content || "")}
    </div>
    `;
}

function getCellContentFromState(
  state: AppState["cellData"],
  cellId: string
): string {
  return state[cellId] || "";
}

export function getCellId(rowIdx: number, colIdx: number) {
  return `${rowIdx}:${colIdx}`;
}

function createCellsForRow(
  state: AppState,
  colsCount: number,
  rowIdx: number
): string {
  const cols = [];
  for (let colIdx = 0; colIdx < colsCount; colIdx++) {
    cols.push(createCell(colIdx, rowIdx, state));
  }
  return cols.join("");
}

function createRow(
  number: number | string,
  content: string,
  height: string | undefined
): string {
  const resizer = number
    ? '<div class="row-resize" data-resize="row"></div>'
    : "";
  return `
      <div class="row" 
          data-type="resizable"
          data-row-index=${number}
          ${height && `style="height:${height}"`}
          >
        <div class="row-info">
          ${number}
          ${resizer}
        </div>
        <div class="row-data">${content}</div>
      </div>
    `;
}

function getWidthInPx(
  colState: Partial<AppState["sizes"]["colState"]>,
  idx: number
): string | undefined {
  return colState && colState[idx] ? `${colState[idx]}px` : undefined;
}

function getHeigthInPx(
  rowState: Partial<AppState["sizes"]["rowState"]>,
  idx: number
): string | undefined {
  return rowState && rowState[idx] ? `${rowState[idx]}px` : undefined;
}

export function createTable(rowsCount: number = 15, state: AppState): string {
  const colsCount = codes.Z - codes.A + 1;

  const rows = [];
  rows.push(
    createRow(
      "",
      generateColumnTitle(colsCount, state.sizes.colState),
      undefined
    )
  );
  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    rows.push(
      createRow(
        rowIdx + 1,
        createCellsForRow(state, colsCount, rowIdx),
        getHeigthInPx(state.sizes.rowState, rowIdx + 1)
      )
    );
  }
  return rows.join("");
}

function generateColumnTitle(
  colsCount: number,
  state: AppState["sizes"]["colState"]
) {
  function createCol(title: string, idx: number, width?: string): string {
    return `
          <div class="column" 
              data-type="resizable" 
              data-column-index="${idx}"
              ${width && `style="width:${width}"`}
              >
              ${title}
              <div class="col-resize" data-resize="col"></div>
          </div>
          `;
  }
  return new Array(colsCount)
    .fill("")
    .map((_, idx) => String.fromCharCode(codes.A + idx))
    .map((col, idx) => {
      return createCol(col, idx, getWidthInPx(state, idx));
    })
    .join("");
}
