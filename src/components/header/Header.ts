import { AppComponent, AppComponentOptions } from "../../core/AppComponent";
import { Dom } from "../../core/dom";
import { renameTableAction } from "./header.actions";
import { ActiveRoute } from "../../core/routes/ActiveRoute";
import { App } from "../app/App";

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

  onClick(event: MouseEvent): void {
    const action: "delete" | "exit" = (event.target as HTMLButtonElement)
      .dataset.action as "delete" | "exit";
    console.log("Header -> onClick -> action", action);
    switch (action) {
      case "delete": {
        console.log("Header -> onClick -> delete");
        const shouldProceed = confirm("Do you realy want to delete the table?");
        if (shouldProceed) {
          localStorage.removeItem(App.tableStorageKey);
          ActiveRoute.navigate("dashboard");
        }
        break;
      }
      case "exit": {
        console.log("Header -> onClick -> exit");

        ActiveRoute.navigate("dashboard");
        break;
      }
    }
  }

  toHTML() {
    const tableName = this.store.getState().tableName || "";
    return `
    <label>
    Table name:
    <input type="text" class="input" value="${tableName}" />
    </label>

    <div>
      <div class="button" data-action="delete" title="Delete table">
        <i class="material-icons" data-action="delete">delete</i>
      </div>

      <div class="button" data-action="exit" title="Exit to dashboard">
        <i class="material-icons" data-action="exit">exit_to_app</i>
      </div>
    </div>`;
  }
}
