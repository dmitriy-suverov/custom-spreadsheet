import { AppComponent } from "../../core/AppComponent";
import { Dom } from "../../core/dom";

export class Header extends AppComponent {
  static className = "excel__header";
  constructor($root: Dom) {
    super($root, {
      listeners: ["input", "click"]
    });
    console.log();
  }
  toHTML() {
    return `
    <input type="text" class="input" value="Новая таблица" />

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
