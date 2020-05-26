import { DomListener } from "./DomListener";
import { Dom } from "./dom";
import { Emmiter, AppEvents } from "./Emitter";
import { AppAction, Store, AppState } from "./store/Store";

export interface AppComponentOptions {
  name?: string;
  listeners: (keyof HTMLElementEventMap)[];
  emmiter: Emmiter;
  store: Store;
  subscribeToStoreFields?: (keyof AppState)[];
}

export abstract class AppComponent extends DomListener {
  static className: string = "";

  private readonly emitter: Emmiter;
  private readonly unsubscribers: Function[] = [];
  protected readonly store: Store;
  private readonly _subscribeToStoreFields: (keyof AppState)[];

  public constructor($root: Dom, options: AppComponentOptions) {
    super($root, options.listeners || []);
    this.name = options.name || this.constructor.prototype.constructor.name;
    this.onBeforeInit();
    this.emitter = options.emmiter;
    this.store = options.store;
    this._subscribeToStoreFields = options.subscribeToStoreFields || [];
  }

  get fieldsToSubscribeInStore() {
    return this._subscribeToStoreFields;
  }

  protected onBeforeInit() {}

  public toHTML(): string {
    throw new Error("Not implemented");
  }

  public emit(event: AppEvents, ...rest) {
    this.emitter.emit(event, ...rest);
  }

  public on(event: AppEvents, cb: Function) {
    this.unsubscribers.push(this.emitter.subscribe(event, cb));
  }

  public dispatch(action: AppAction): void {
    this.store.dispatch(action);
  }

  storeChanged(changes) {
    // todo remove
    console.debug("AppComponent -> storeChanged -> changes", changes);
  }

  public isSubscribedToField(fieldName: keyof AppState): boolean {
    return this.fieldsToSubscribeInStore.includes(fieldName);
  }

  public init() {
    this.initDOMListeners();
  }

  public destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach(unsubFn => unsubFn());
  }
}
