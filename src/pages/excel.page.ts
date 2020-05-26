import { Page } from "../core/routes/Page";
import { debounce, getFromStorage, setToStorage } from "../core/utils";
import { createStore } from "../core/store/create-store";
import { Store, AppState } from "../core/store/Store";
import { App } from "../components/app/App";
import { Header } from "../components/header/Header";
import { Toolbar } from "../components/toolbar/Toolbar";
import { Formula } from "../components/formula/Formula";
import { Table } from "../components/table/Table";

// todo rename excel class
export class ExcelPage extends Page {
  public constructor(private readonly tableId: number) {
    super();
  }

  private component: App;

  init() {
    const loadedState = getFromStorage(this.composeStorageKey());

    let store: Store;
    if (loadedState) {
      store = createStore(this.tableId, loadedState);
    } else {
      store = createStore(this.tableId);
    }

    (store as Store).subscribe(
      debounce(
        (state: AppState) => setToStorage(this.composeStorageKey(), state),
        300
      )
    );

    store.subscribe(state => console.log("state", state));

    this.component = new App(this.tableId, {
      components: [Header, Toolbar, Formula, Table],
      store
    });
  }

  private composeStorageKey(): string {
    return `${Store.STORAGE_KEY}/${this.tableId}`;
  }

  getRoot() {
    this.init();
    return this.component.getRoot();
  }

  afterRender() {
    this.component.init();
  }

  destroy() {
    this.component.onDestroy();
  }
}
