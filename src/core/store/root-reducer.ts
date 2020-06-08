import { AppState } from "./app-state.interface";
import { AppAction } from "./Store";

export type RootReducerType<T = AppAction> = (
  state: Record<keyof AppState, any>,
  action: T
) => Record<keyof AppState, any>;
