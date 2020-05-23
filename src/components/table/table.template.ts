import { AppState } from "../../core/Store";

const codes = {
  A: 65,
  Z: 90
};

function createCell(
  content: string = "",
  colIdx: number,
  rowIdx: number,
  width: string | undefined
): string {
  return `
    <div class="cell"
     data-type="cell"
     contenteditable="" 
     data-col="${colIdx}" 
     data-id="${colIdx}:${rowIdx}"
     ${width && `style="width:${width}"`}

     >
      ${content}
     </div>
    `;
}

function getCellContentFromState(
  state: AppState["cellData"],
  rowIdx: number,
  colIdx: number
) {
  const key = `${rowIdx}:${colIdx}`;
  return state[key];
}

function createCellsForRow(
  state: AppState,
  colsCount: number,
  rowIdx: number
): string {
  const cols = [];
  for (let colIdx = 0; colIdx < colsCount; colIdx++) {
    const content = getCellContentFromState(state.cellData, colIdx, rowIdx);
    cols.push(
      createCell(
        content,
        colIdx,
        rowIdx,
        getWidthInPx(state.sizes.colState, colIdx)
      )
    );
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
