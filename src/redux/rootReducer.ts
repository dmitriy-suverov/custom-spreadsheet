import { AppAction, AppState } from "../core/Store";
import {
  resizeAction,
  changeTextAction
} from "../components/table/table.actions";

export function rootReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TABLE_RESIZE": {
      const newColState = (action as ReturnType<typeof resizeAction>).payload
        .type === "col" && { [action.payload.id]: action.payload.value };
      const newRowState = (action as ReturnType<typeof resizeAction>).payload
        .type === "row" && { [action.payload.id]: action.payload.value };

      const newState = { ...state };
      if (newColState) {
        newState.sizes.colState = {
          ...state.sizes.colState,
          ...newColState
        };
      } else {
        newState.sizes.rowState = {
          ...state.sizes.rowState,
          ...newRowState
        };
      }
      return newState;
    }

    case "CHANGE_TEXT": {
      const newState = { ...state };
      const data = (action as ReturnType<typeof changeTextAction>).payload;
      console.log("functionrootReducer -> data", data);
      newState.cellData = {
        ...state.cellData,
        ...data
      };

      return newState;
    }
  }

  return { ...state };
}
