import { Store, AppState } from "./Store";
import { AppComponent } from "./AppComponent";
import { isEqual } from "./utils";
import { DEFAULT_STATE } from "./createStore";

export class StoreSubscriber {
  private sub = null;
  private prevState: AppState;
  constructor(private readonly store: Store) {
    this.prevState = this.store.getState();
  }

  subscribeComponents(components: AppComponent[] = []) {
    this.sub = this.store.subscribe(state => {
      Object.keys(state).forEach((key: keyof AppState) => {
        if (this.shouldUpdate(this.prevState[key], state[key])) {
          components.forEach(component => {
            if (component.isSubscribedToField(key)) {
              const changes = { [key]: state[key] };
              component.storeChanged(changes);
            }
          });
        }
      });
      this.prevState = this.store.getState();
    });
  }

  unsubscrubeFromStore() {
    this.sub.unsubscribe();
  }

  private shouldUpdate(prevState, currentState) {
    return !isEqual(prevState, currentState);
  }
}
