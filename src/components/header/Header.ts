import { AppComponent, AppComponentOptions } from "../../core/AppComponent";
import { Dom } from "../../core/dom";

export class Header extends AppComponent {
  static className = "excel__header";
  constructor($root: Dom, options: AppComponentOptions) {
    super($root, {
      listeners: ["input", "click"],
      ...options
    });
    console.log();
  }
  toHTML() {
    return `
    <input type="text" class="input" value="New table" />

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
