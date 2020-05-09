import "./scss/index.scss";
import { App } from "./components/app/App";
import { Toolbar } from "./components/toolbar/Toolbar";
import { Formula } from "./components/formula/Formula";
import { Table } from "./components/table/Table";
import { Header } from "./components/header/Header";

const excel = new App("#app", {
  components: [Header, Toolbar, Formula, Table]
});
excel.run();

// setTimeout(() => {
//   excel.exit();
// }, 5000);
