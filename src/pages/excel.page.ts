import { Page } from "../core/routes/Page";
import { debounce, getFromStorage, setToStorage } from "../core/utils";
import { createStore } from "../core/createStore";
import { Store, AppState } from "../core/Store";
import { rootReducer } from "../redux/rootReducer";
import { App } from "../components/app/App";
import { Header } from "../components/header/Header";
import { Toolbar } from "../components/toolbar/Toolbar";
import { Formula } from "../components/formula/Formula";
import { Table } from "../components/table/Table";

// todo rename excel class
export class ExcelPage extends Page {
  public constructor(private readonly tableId: number) {
    super();
    console.log("ExcelPage -> constructor -> tableId", this.tableId);
  }

  private component: App;

  init() {
    const loadedState = getFromStorage(this.composeStorageKey());

    console.log("ExcelPage -> init -> loadedState", loadedState);
    let store: Store;
    if (loadedState) {
      store = createStore(rootReducer, this.tableId, loadedState);
    } else {
      store = createStore(rootReducer, this.tableId);
    }

    (store as Store).subscribe(
      debounce(
        (state: AppState) => setToStorage(this.composeStorageKey(), state),
        300
      )
    );

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
