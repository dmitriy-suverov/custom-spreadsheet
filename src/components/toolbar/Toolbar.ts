import { AppComponent, AppComponentOptions } from "../../core/AppComponent";
import { Dom } from "../../core/dom";

export class Toolbar extends AppComponent {
  static className = "excel__toolbar";

  constructor($root: Dom, options: AppComponentOptions) {
    super($root, {
      listeners: ["click"],
      ...options
    });
  }

  toHTML() {
    return `
          <div class="button">
            <i class="material-icons">format_align_left</i>
          </div>

          <div class="button">
            <i class="material-icons">format_align_center</i>
          </div>

          <div class="button">
            <i class="material-icons">format_align_right</i>
          </div>

          <div class="button">
            <i class="material-icons">format_bold</i>
          </div>

          <div class="button">
            <i class="material-icons">format_italic</i>
          </div>

          <div class="button">
            <i class="material-icons">format_underlined</i>
          </div>
    `;
  }
}
