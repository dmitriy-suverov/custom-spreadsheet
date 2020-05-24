import { AppComponentOptions } from "../../core/AppComponent";
import { Dom } from "../../core/dom";
import { createToolbar } from "./toolbar.template";
import { AppStatefulComponent } from "../../core/AppStatefulComponent";
import { DEFAULT_STYLES } from "../../constants";

type State = typeof DEFAULT_STYLES;

export class Toolbar extends AppStatefulComponent<State> {
  static className = "excel__toolbar";

  constructor($root: Dom, options: AppComponentOptions) {
    super($root, {
      listeners: ["click"],
      subscribeToStoreFields: ["currentStyles"],
      ...options
    });
  }

  // move to parent class, use static field for default state
  onBeforeInit() {
    this.initState(DEFAULT_STYLES);
  }

  get template() {
    return createToolbar(this.state);
  }

  toHTML() {
    return this.template;
  }

  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const shouldHandleClick = target.dataset.type === "tb-button";
    if (!shouldHandleClick) {
      event.stopPropagation();
      return;
    }

    const style = JSON.parse(target.dataset.value);
    const key = Object.keys(style)[0] as keyof State;
    this.setState({ [key]: style[key] });
    this.emit("toolbar:applyStyle", style);
  }

  storeChanged(changes) {
    this.setState(changes.currentStyles);
  }
}
