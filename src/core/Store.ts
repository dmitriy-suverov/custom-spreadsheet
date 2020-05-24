import { TABLE_ACTIONS } from "../components/table/table.actions";
import { HEADER_ACTIONS } from "../components/header/header.actions";
import { TOOLBAR_ACTIONS } from "../redux/actions";

export interface AppAction {
  type: "__INIT__" | TABLE_ACTIONS | HEADER_ACTIONS | TOOLBAR_ACTIONS;
  payload?: any;
}

const initAction: AppAction = {
  type: "__INIT__"
};

export type RootReducerType<T = AppAction> = (
  state: Record<keyof AppState, any>,
  action: T
) => Record<keyof AppState, any>;

export type AppState = {
  sizes: {
    colState: { [key: string]: number };
    rowState: { [key: string]: number };
  };
  cellData: { [key: string]: string };
  currentText: string;
  currentStyles: {
    [key in keyof CSSStyleDeclaration]?: string;
  };
  selectedCellId: string;
  tableName: string;
  stylesState: {
    [cellId: string]: {
      [styleName in keyof CSSStyleDeclaration]?: string;
    };
  };
};

export class Store {
  public static STORAGE_KEY = "sheetsjs-state";
  private state: AppState;
  private readonly listeners: Function[] = [];

  private static instance: Store;

  private constructor(
    private readonly rootReducer: RootReducerType,
    initialState: AppState
  ) {
    this.state = rootReducer({ ...initialState }, initAction);
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
      unsubscribe() {
        this.listeners = this.listeners.filter(listener => listener !== fn);
      }
    };
  }
  dispatch(action: AppAction) {
    this.state = this.rootReducer({ ...this.state }, action);
    this.listeners.forEach(listener => listener(this.state));
  }
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }
}
