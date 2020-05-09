import { AppComponent } from "../../core/AppComponent";
import { $ } from "../../core/dom";

export interface Type<T extends AppComponent> {
  new (...args: any[]): T;
}

export class App {
  private readonly $el: ReturnType<typeof $>;
  private readonly components: Type<AppComponent>[];
  private componentsInstances: AppComponent[];
  constructor(
    selector: string,
    options: {
      components: Type<AppComponent>[];
    } = { components: [] }
  ) {
    this.$el = $(selector);
    this.components = options.components || [];
  }

  getRoot() {
    const $root = $.create("div", "excel");

    this.componentsInstances = this.components.map(Component => {
      // @ts-ignore
      const $el = $.create("div", Component.className);
      const component = new Component($el);
      $el.html(component.toHTML());
      $root.append($el);
      return component;
    });

    return $root;
  }

  private render() {
    this.$el.append(this.getRoot());
  }

  public run() {
    this.render();
    this.componentsInstances.forEach(instance => instance.init());
  }

  private onExit() {
    this.componentsInstances.forEach(instance => instance.destroy());
  }

  public exit() {
    console.log("App -> exit -> exit");
    this.onExit();
  }
}
