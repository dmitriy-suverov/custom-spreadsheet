import { DomListener } from "./DomListener";
import { Dom } from "./dom";
import { Type } from "../components/app/App";
import { Emmiter, AppEvents } from "./Emitter";

export interface AppComponentOptions {
  name?: string;
  listeners: (keyof HTMLElementEventMap)[];
  emmiter: Emmiter;
}

export abstract class AppComponent extends DomListener {
  static className: string = "";
  private readonly emitter: Emmiter;
  private readonly unsubscribers: Function[] = [];

  public constructor($root: Dom, options: AppComponentOptions) {
    super($root, options.listeners || []);
    this.name = options.name || this.constructor.prototype.constructor.name;
    this.prepare();
    this.emitter = options.emmiter;
  }

  protected prepare() {}

  public toHTML(): string {
    throw new Error("Not implemented");
  }

  public emit(event: AppEvents, ...rest) {
    this.emitter.emit(event, ...rest);
  }

  public on(event: AppEvents, cb: Function) {
    this.unsubscribers.push(this.emitter.subscribe(event, cb));
  }

  public unsubscribeAll() {
    this.unsubscribers.forEach(unsubFn => unsubFn());
  }

  init() {
    this.initDOMListeners();
  }

  destroy() {
    this.removeDOMListeners();
    this.unsubscribeAll();
  }
}
