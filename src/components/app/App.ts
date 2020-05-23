import { AppComponent, AppComponentOptions } from "../../core/AppComponent";
import { $ } from "../../core/dom";
import { Emmiter as AppEmitter } from "../../core/Emitter";
import { Store } from "../../core/Store";
import { StoreSubscriber } from "../../core/StoreSubscriber";

// evaluates type as Class itself, not instance of T
export interface Type<T extends AppComponent> {
  new (...args: any[]): T;
}

interface AppOptions {
  components: Type<AppComponent>[];
  store: Store;
}

export class App {
  private readonly $el: ReturnType<typeof $>;
  private readonly components: Type<AppComponent>[];
  private componentsInstances: AppComponent[];
  private readonly emmiter: AppEmitter;
  private readonly store: Store;
  private readonly subsriber: StoreSubscriber;

  constructor(selector: string, options: AppOptions) {
    this.$el = $(selector);
    this.components = options.components || [];
    this.store = options.store;
    this.emmiter = new AppEmitter();
    this.subsriber = new StoreSubscriber(this.store)
  }

  getRoot() {
    const $root = $.create("div", "excel");

    const componentOptions: Partial<AppComponentOptions> = Object.freeze({
      emmiter: this.emmiter,
      store: this.store
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
    this.subsriber.subscribeComponents(this.componentsInstances)
  }

  public run() {
    this.render();
    this.componentsInstances.forEach(instance => instance.init());
  }

  private onExit() {
    this.componentsInstances.forEach(instance => instance.destroy());
    this.subsriber.unsubscrubeFromStore();
  }

  public exit() {
    this.onExit();
  }
}
