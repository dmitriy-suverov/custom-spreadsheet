import { Store, RootReducerType, AppState } from "./Store";

export const DEFAULT_STATE: AppState = {
  sizes: {
    colState: {},
    rowState: {}
  },
  cellData: {},
  selectedCellId: `0:0`,
  currentText: "",
  tableName: "New table"
};

export function createStore(
  rootReducer: RootReducerType,
  initialState: AppState = DEFAULT_STATE
) {
  return Store.getInstance(rootReducer, initialState);
}
