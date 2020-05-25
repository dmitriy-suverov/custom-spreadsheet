import { $, Dom } from "../dom";
import { ActiveRoute } from "./ActiveRoute";
import { Page } from "./Page";

type PageConstructor = new (...args: any[]) => Page;

export class Router {
  private readonly mountNode: Dom;
  private currentPage: Page;

  public constructor(
    mountNodeSelector: string,
    private readonly routes: Record<string, PageConstructor>
  ) {
    this.mountNode = $(mountNodeSelector);
    this.init();
  }

  private init() {
    window.addEventListener("hashchange", this.changePageHandler);
  }

  private changePageHandler = () => {
    this.currentPage && this.currentPage.destroy();
    this.renderCurrentPage();
  };

  private renderCurrentPage() {
    const PageComponent = ActiveRoute.path.includes("excel")
      ? this.routes.excel
      : this.routes.dashboard;
    this.currentPage = new PageComponent(ActiveRoute.param);
    this.mountNode.$el.innerHTML = "";
    this.mountNode.append(this.currentPage.getRoot());
    this.currentPage.afterRender();
  }

  destroy() {
    window.removeEventListener("hashchange", this.changePageHandler);
  }

  public run() {
    this.renderCurrentPage();
  }
}
