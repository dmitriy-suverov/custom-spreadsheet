const codes = { 
  A: 65,
  Z: 90
};

function createCell(
  content: string = "",
  colIdx: number,
  rowIdx: number
): string {
  return `
    <div class="cell"
     data-type="cell"
     contenteditable="" 
     data-col="${colIdx}" 
     data-id="${rowIdx}:${colIdx}"
     >
      ${content}
     </div>
    `;
}

function createCellsForRow(colsCount: number, rowIdx: number): string {
  const cols = [];
  for (let colIdx = 0; colIdx < colsCount; colIdx++) {
    cols.push(createCell("", colIdx, rowIdx));
  }
  return cols.join("");
}

function createRow(number: number | string, content: string): string {
  const resize = number
    ? '<div class="row-resize" data-resize="row"></div>'
    : "";
  return `
      <div class="row" data-type="resizable">
        <div class="row-info">
          ${number}
          ${resize}
        </div>
        <div class="row-data">${content}</div>
      </div>
    `;
}

export function createTable(rowsCount: number = 15): string {
  const colsCount = codes.Z - codes.A + 1;

  const rows = [];
  rows.push(createRow("", generateColumnTitle(colsCount)));
  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    rows.push(createRow(rowIdx + 1, createCellsForRow(colsCount, rowIdx)));
  }
  return rows.join("");
}

function generateColumnTitle(colsCount: number) {
  function createCol(title: string, idx: number): string {
    return `
          <div class="column" data-type="resizable" data-column-index="${idx}">
              ${title}
              <div class="col-resize" data-resize="col"></div>
          </div>
          `;
  }
  return new Array(colsCount)
    .fill("")
    .map((_, idx) => String.fromCharCode(codes.A + idx))
    .map(createCol)
    .join("");
}
