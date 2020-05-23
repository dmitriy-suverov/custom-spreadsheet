import { FORMULA_EVENTS } from "../components/formula/Formula";
import { TABLE_EVENTS } from "../components/table/Table";

export type AppEvents = FORMULA_EVENTS | TABLE_EVENTS;

export class Emmiter {
  private readonly subscribers: Partial<Record<AppEvents, Function[]>> = {};
  constructor() {}

  emit(eventName: AppEvents, ...payload): void {
    if (!Array.isArray(this.subscribers[eventName])) {
      return;
    }
    this.subscribers[eventName].forEach(callback => {
      callback(...payload);
    });
  }

  subscribe(eventName: AppEvents, subscriberCallback: Function): () => void {
    this.subscribers[eventName]
      ? this.subscribers[eventName].push(subscriberCallback)
      : (this.subscribers[eventName] = [subscriberCallback]);

    return () => {
      this.subscribers[eventName] = this.subscribers[eventName].filter(
        callback => callback != subscriberCallback
      );
    };
  }
}
