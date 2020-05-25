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
import { Router } from "./core/routes/Router";
import { DashboardPage } from "./pages/dashboard.page";
import { ExcelPage } from "./pages/excel.page";



new Router("#app", {
  dashboard: DashboardPage,
  excel: ExcelPage
}).run()

// setTimeout(() => {
//   excel.exit();
// }, 5000);
