import "./scss/index.scss";
import { App } from "./components/app/App";
import { Toolbar } from "./components/toolbar/Toolbar";
import { Formula } from "./components/formula/Formula";
import { Table } from "./components/table/Table";
import { Header } from "./components/header/Header";
import { createStore } from "./core/createStore";
import { rootReducer } from "./redux/rootReducer";
import { setToStorage, getFromStorage, debounce } from "./core/utils";
import { Store, AppState } from "./core/Store";

const loadedState = getFromStorage(Store.STORAGE_KEY);
let store;
if (loadedState) {
  store = createStore(rootReducer, loadedState);
} else {
  store = createStore(rootReducer);
}

(store as Store).subscribe(
  debounce((state: AppState) => setToStorage(Store.STORAGE_KEY, state), 300)
);

const excel = new App("#app", {
  components: [Header, Toolbar, Formula, Table],
  store
});
excel.run();

// setTimeout(() => {
//   excel.exit();
// }, 5000);
