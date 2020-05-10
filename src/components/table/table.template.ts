const codes = {
  A: 65,
  Z: 90
};

function createCell(content: string = "", colIdx: string): string {
  return `
    <div class="cell" contenteditable="" data-column-index="${colIdx}">${content}</div>
    `;
}

function createCellsForRow(colsCount: number): string {
  const cols = [];
  for (let i = 0; i < colsCount; i++) {
    cols.push(createCell("", String.fromCharCode(codes.A + i)));
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

function generateColumnTitle(colsCount: number) {
  function createCol(title: string): string {
    return `
          <div class="column" data-type="resizable" data-column-index="${title}">
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

export function createTable(rowsCount: number = 15): string {
  const colsCount = codes.Z - codes.A + 1;

  const rows = [];
  rows.push(createRow("", generateColumnTitle(colsCount)));
  for (let i = 0; i < rowsCount; i++) {
    rows.push(createRow(i + 1, createCellsForRow(colsCount)));
  }
  return rows.join("");
}
