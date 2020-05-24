import { Store, RootReducerType, AppState } from "./Store";
import { DEFAULT_STYLES } from "../constants";

export const DEFAULT_STATE: AppState = {
  sizes: {
    colState: {},
    rowState: {}
  },
  cellData: {},
  selectedCellId: `0:0`,
  currentText: "",
  tableName: "New table",
  currentStyles: DEFAULT_STYLES,
  stylesState: {}
};

export function createStore(
  rootReducer: RootReducerType,
  initialState: AppState = DEFAULT_STATE
) {
  return Store.getInstance(rootReducer, initialState);
}
