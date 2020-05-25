import { Store, RootReducerType, AppState } from "./Store";
import { DEFAULT_STYLES } from "../constants";

export const DEFAULT_STATE: AppState = {
  tableId: undefined,
  createdAt: Date.now(),
  sizes: {
    colState: {},
    rowState: {}
  },
  cellData: {},
  currentText: "",
  tableName: "New table",
  currentStyles: DEFAULT_STYLES,
  stylesState: {}
};

export function createStore(
  rootReducer: RootReducerType,
  tableId: number,
  initialState: AppState = DEFAULT_STATE
) {
  const state = { ...initialState };
  state.tableId = tableId;
  return Store.getInstance(rootReducer, state);
}
