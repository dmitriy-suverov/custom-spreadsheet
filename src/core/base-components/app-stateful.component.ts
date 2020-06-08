import { AppComponent } from "./app.component";

export abstract class AppStatefulComponent<T extends {}> extends AppComponent {
  protected state: T;

  initState(initialState: T = {} as T) {
    this.state = { ...initialState };
  }

  abstract get template();

  setState(newState: Partial<T>) {
    this.state = Object.assign(this.state, { ...newState });
    this.$root.html(this.template);
  }
}
