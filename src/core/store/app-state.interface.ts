export interface AppState {
  tableId: number;
  createdAt: number;
  sizes: {
    colState: { [key: string]: number };
    rowState: { [key: string]: number };
  };
  cellData: { [key: string]: string };
  currentText: string;
  currentStyles: {
    [key in keyof CSSStyleDeclaration]?: string;
  };
  tableName: string;
  stylesState: {
    [cellId: string]: {
      [styleName in keyof CSSStyleDeclaration]?: string;
    };
  };
}
