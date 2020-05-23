import { AppComponent, AppComponentOptions } from "../../core/AppComponent";
import { Dom } from "../../core/dom";
import { renameTableAction } from "./header.actions";

export class Header extends AppComponent {
  static className = "excel__header";
  constructor($root: Dom, options: AppComponentOptions) {
    super($root, {
      listeners: ["input", "click"],
      subscribeToStoreFields: ["tableName"],
      ...options
    });
    console.log();
  }

  onInput(event: KeyboardEvent): void {
    const value = (event.target as HTMLInputElement).value;
    this.dispatch(renameTableAction(value));
  }

  toHTML() {
    const tableName = this.store.getState().tableName || "";
    return `
    <label>
    Table name:
    <input type="text" class="input" value="${tableName}" />
    </label>

    <div>
      <div class="button">
        <i class="material-icons">delete</i>
      </div>

      <div class="button">
        <i class="material-icons">exit_to_app</i>
      </div>
    </div>`;
  }
}
