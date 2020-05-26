import { Router } from "../Router";
import { ExcelPage } from "../../../pages/excel.page";
import { $, Dom } from "../../dom";
import { DashboardPage } from "../../../pages/dashboard.page";
import { ActiveRoute } from "../ActiveRoute";

class ExcelTestPage extends ExcelPage {
  getRoot() {
    const node = document.createElement("div");
    node.innerHTML = "excel page";

    return $(node);
  }
}

class DashboardTestPage extends DashboardPage {
  getRoot() {
    const node = document.createElement("div");
    node.innerHTML = "dashboard page";

    return $(node);
  }
}

describe("Router", () => {
  let router: Router;
  let mountNode: HTMLDivElement;
  beforeEach(() => {
    mountNode = document.createElement("div");
    router = new Router($(mountNode), {
      excel: ExcelTestPage,
      dashboard: DashboardTestPage
    });
  });

  afterEach(() => {
    mountNode = null;
  });

  it("should render default page with no crash", () => {
    router.run();
  });

  it("should render dashboard page", () => {
    router.run();
    const dashboardPage = new DashboardTestPage();
    expect(mountNode.innerHTML).toBe(dashboardPage.getRoot().html());
  });

  it("should render excel page", () => {
    router.run();
    const testTableId = 42;
    const excelPage = new ExcelTestPage(testTableId);
    router["renderPage"](excelPage);
    expect(mountNode.innerHTML).toBe(excelPage.getRoot().html());
  });
});
