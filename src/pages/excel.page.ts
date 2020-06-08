import { Page } from "../core/routing/page";
import { debounce, getFromStorage, setToStorage } from "../core/utils";
import { createStore } from "../core/store/create-store";
import { Store } from "../core/store/Store";
import { Editor } from "../components/editor/editor.component";
import { Header } from "../components/header/Header";
import { Toolbar } from "../components/toolbar/Toolbar";
import { Formula } from "../components/formula/formula.component";
import { Table } from "../components/table/Table";
import { AppState } from "../core/store/app-state.interface";

// todo rename excel class
export class ExcelPage extends Page {
  public constructor(private readonly tableId: number) {
    super();
  }

  private component: Editor;
  private storeSub: ReturnType<Store["subscribe"]>;

  init() {
    const loadedState = getFromStorage(this.composeStorageKey());

    let store: Store;
    if (loadedState) {
      store = createStore(this.tableId, loadedState);
    } else {
      store = createStore(this.tableId);
    }

    this.storeSub = (store as Store).subscribe(
      debounce(
        (state: AppState) => setToStorage(this.composeStorageKey(), state),
        300
      )
    );

    store.subscribe(state => console.log("state", state));

    this.component = new Editor(this.tableId, {
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
    this.component.destroy();
    this.storeSub.unsubscribe();
  }
}
