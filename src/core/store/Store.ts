import { TABLE_ACTIONS } from "../../components/table/table.actions";
import { HEADER_ACTIONS } from "../../components/header/header.actions";
import { TOOLBAR_ACTIONS } from "../../redux/actions";
import { AppState } from "./app-state.interface";
import { RootReducerType } from "./root-reducer";

export interface AppAction {
  type: "__INIT__" | TABLE_ACTIONS | HEADER_ACTIONS | TOOLBAR_ACTIONS;
  payload?: any;
}

const initAction: AppAction = {
  type: "__INIT__"
};

export class Store {
  public static STORAGE_KEY = "excel-table";
  private state: AppState;
  private listeners: Function[] = [];

  private static instance: Store;

  private constructor(
    private readonly rootReducer: RootReducerType,
    initialState: AppState
  ) {
    this.state = rootReducer({ ...initialState }, initAction);
    if (!this.state.tableId) {
      throw new Error("tableId must be provided");
    }
  }

  public static getInstance(
    rootReducer: RootReducerType,
    initialState: AppState
  ): Store {
    if (!Store.instance) {
      Store.instance = new Store(rootReducer, initialState);
    }

    return Store.instance;
  }

  subscribe(fn: (state: AppState) => void) {
    this.listeners.push(fn);

    return {
      unsubscribe: () => {
        this.listeners = (this.listeners || []).filter(listener => {
          return listener !== fn;
        });
      }
    };
  }
  dispatch(action: AppAction) {
    this.state = this.rootReducer({ ...this.state }, action);
    this.listeners.forEach(listener => listener(this.state));
  }
  getState(): AppState {
    return JSON.parse(JSON.stringify(this.state));
  }
}
