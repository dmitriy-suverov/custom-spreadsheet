import { AppComponent, AppComponentOptions } from "../../core/AppComponent";
import { $ } from "../../core/dom";
import { Emmiter as AppEmitter } from "../../core/Emitter";

export interface Type<T extends AppComponent> {
  new (...args: any[]): T;
}

export class App {
  private readonly $el: ReturnType<typeof $>;
  private readonly components: Type<AppComponent>[];
  private componentsInstances: AppComponent[];
  private readonly emmiter: AppEmitter;
  constructor(
    selector: string,
    options: {
      components: Type<AppComponent>[];
    } = { components: [] }
  ) {
    this.$el = $(selector);
    this.components = options.components || [];
    this.emmiter = new AppEmitter();
  }

  getRoot() {
    const $root = $.create("div", "excel");

    const componentOptions: Partial<AppComponentOptions> = Object.freeze({
      emmiter: this.emmiter
    });
    this.componentsInstances = this.components.map(Component => {
      // @ts-ignore Component.className is static, and is always present
      const $el = $.create("div", Component.className);
      const component = new Component($el, componentOptions);
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
    this.onExit();
  }
}
