import {
  AppComponent,
  AppComponentOptions
} from "../../core/base-components/app.component";
import { $, Dom } from "../../core/dom";
import { AppState } from "../../core/store/app-state.interface";

export type FORMULA_EVENTS = "formula:input" | "formula:end-of-input";

export class Formula extends AppComponent {
  static className = "excel__formula";

  constructor($root: Dom, options: AppComponentOptions) {
    super($root, {
      listeners: ["input", "click", "keydown"],
      subscribeToStoreFields: ["currentText"],
      ...options
    });
  }

  init() {
    super.init();
    const $input = this.$root.find(".input");
    this.on("table:select", ($cell: Dom) => {
      $input.text($cell.data.value);
    });
    this.on("table:input", text => $input.text(text));
  }

  onInput(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    this.emit("formula:input", $(target).text());
  }

  onKeydown(event: KeyboardEvent) {
    if (["enter", "tab"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      this.emit("formula:end-of-input");
    }
  }

  onClick(event: Event) {
    console.log(
      "Formula input",
      (event.target as HTMLInputElement).textContent
    );
  }

  toHTML() {
    return `
    <div class="info">fx</div>
    <div class="input" contenteditable spellcheck="false"></div>
    `;
  }

  storeChanged(changes) {
    console.log("AppComponent -> storeChanged -> changes", changes);
  }

  public isSubscribedToField(fieldName: keyof AppState): boolean {
    return this.fieldsToSubscribeInStore.includes(fieldName);
  }
}
