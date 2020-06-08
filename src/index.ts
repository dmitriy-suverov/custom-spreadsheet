import "./scss/index.scss";
import { Router } from "./core/routing/router";
import { $ } from "./core/dom";
import { DashboardPage } from "./pages/dashboard.page";
import { ExcelPage } from "./pages/excel.page";

const mountNode = $("#app");

new Router(mountNode, {
  dashboard: DashboardPage,
  excel: ExcelPage
}).run();
