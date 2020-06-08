import { AppComponent, AppComponentOptions } from "../../core/base-components/app.component";
import { $ } from "../../core/dom";
import { Emmiter as AppEmitter } from "../../core/Emitter";
import { Store } from "../../core/store/Store";
import { StoreSubscriber } from "../../core/StoreSubscriber";

// evaluates type as Class itself, not instance of T
export interface Type<T extends AppComponent> {
  new (...args: any[]): T;
}

interface AppOptions {
  components: Type<AppComponent>[];
  store: Store;
}

export class Editor {
  private readonly components: Type<AppComponent>[];
  private componentsInstances: AppComponent[];
  private readonly emmiter: AppEmitter;
  private readonly store: Store;
  private readonly subsriber: StoreSubscriber;

  private static tableId: number;

  public static get tableStorageKey(): string {
    return `${Store.STORAGE_KEY}/${Editor.tableId}`;
  }

  constructor(tableId: number, options: AppOptions) {
    this.components = options.components || [];
    this.store = options.store;
    this.emmiter = new AppEmitter();
    this.subsriber = new StoreSubscriber(this.store);
    Editor.tableId = tableId;
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

  public init() {
    this.subsriber.subscribeComponents(this.componentsInstances);
    this.componentsInstances.forEach(instance => instance.init());
  }

  public destroy() {
    this.componentsInstances.forEach(instance => instance.destroy());
    this.subsriber.unsubscrubeFromStore();
  }
}
