const codes = {
  A: 65,
  Z: 90
};

function createCell(content: string = ""): string {
  return `
    <div class="cell" contenteditable="">${content}</div>
    `;
}

function createCellsForRow(colsCount: number): string {
  const cols = [];
  for (let i = 0; i < colsCount; i++) {
    cols.push(createCell(""));
  }
  return cols.join("");
}

function createRow(number: number | string, content: string): string {
  return `
    <div class="row">
        <div class="row-info">${number}</div>
        <div class="row-data">${content}</div>
    </div>
    `;
}

function generateColumnTitle(colsCount: number) {
  function createCol(title: string): string {
    return `
          <div class="column">
              ${title}
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
