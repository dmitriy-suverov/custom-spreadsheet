import { createStore, DEFAULT_STATE } from "../create-store";
import { AppState, Store, AppAction } from "../Store";

describe("createStore", () => {
  const tableId: number = 12;

  beforeEach(() => {
    Store["instance"] = null;
  });

  it("shoul check if store has required methods", () => {
    const store = createStore(tableId);
    expect(store).toBeDefined();
    expect(store.getState).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(store.subscribe).toBeDefined();
  });

  it("should return store with default state", () => {
    const state = createStore(tableId).getState();
    expect(state.cellData).toEqual(DEFAULT_STATE.cellData);
    expect(state.createdAt).toBe(DEFAULT_STATE.createdAt);
    expect(state.currentStyles).toEqual(DEFAULT_STATE.currentStyles);
    expect(state.currentText).toBe(DEFAULT_STATE.currentText);
    expect(state.sizes).toEqual(DEFAULT_STATE.sizes);
    expect(state.stylesState).toEqual(DEFAULT_STATE.stylesState);
    expect(state.tableId).toBe(tableId);
    expect(state.tableName).toBe(DEFAULT_STATE.tableName);
  });

  it("should return store with custom state", () => {
    const initialState: AppState = {
      cellData: { "0:1": "12333" },
      createdAt: Date.now(),
      currentStyles: { textAlign: "center" },
      sizes: { colState: { "0:1": 155 }, rowState: {} },
      currentText: "test-text",
      tableId,
      stylesState: { "0:1": { textAlign: "left", fontWeight: "bold" } },
      tableName: `Test table name`
    };
    //
    const state = createStore(tableId, initialState).getState();
    // console.log("state", state);
    expect(state.cellData).toEqual(initialState.cellData);
    expect(state.createdAt).toBe(initialState.createdAt);
    expect(state.currentStyles).toEqual(initialState.currentStyles);
    expect(state.currentText).toBe(initialState.currentText);
    expect(state.sizes).toEqual(initialState.sizes);
    expect(state.stylesState).toEqual(initialState.stylesState);
    expect(state.tableId).toBe(tableId);
    expect(state.tableName).toBe(initialState.tableName);
  });

  it("should call given listener with state on store update", () => {
    const store = createStore(tableId);
    const listener = jest.fn();
    store.subscribe(listener);

    store.dispatch(({ type: "TEST_ACTION" } as unknown) as AppAction);
    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(store.getState());
  });

  it("should not call given unsubscribed listener with state on store update", () => {
    const store = createStore(tableId);
    const listener = jest.fn();
    const subscription = store.subscribe(listener);
    subscription.unsubscribe();

    store.dispatch(({ type: "TEST_ACTION" } as unknown) as AppAction);
    expect(listener).not.toHaveBeenCalled();
  });
});
