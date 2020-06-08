import { Dom } from "../dom";
import { ActiveRouteService } from "./active-route.service";
import { Page } from "./page";

type PageConstructor = new (...args: any[]) => Page;

export class Router {
  private currentPage: Page;

  public constructor(
    private readonly mountNode: Dom,
    private readonly routes: Record<string, PageConstructor>
  ) {
    this.init();
  }

  private init() {
    window.addEventListener("hashchange", this.changePageHandler);
  }

  private changePageHandler = () => {
    this.currentPage && this.currentPage.destroy();
    this.renderAndInitCurrentPage();
  };

  private renderAndInitCurrentPage() {
    const PageComponent = ActiveRouteService.path.includes("excel")
      ? this.routes.excel
      : this.routes.dashboard;
    this.currentPage = new PageComponent(ActiveRouteService.param);
    this.renderPage(this.currentPage);
    this.currentPage.afterRender();
  }

  private renderPage(page: Page) {
    this.mountNode.$el.innerHTML = "";
    this.mountNode.append(page.getRoot());
  }

  destroy() {
    window.removeEventListener("hashchange", this.changePageHandler);
  }

  public run() {
    this.renderAndInitCurrentPage();
  }
}
