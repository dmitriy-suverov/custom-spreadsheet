import { AppComponent } from "../../core/AppComponent";
import { Dom } from "../../core/dom";

export class Formula extends AppComponent {
  static className = "excel__formula";

  constructor($root: Dom) {
    super($root, {
      listeners: ["input", "click"]
    });
  }

  onInput(event: Event) {
    console.log(
      "Formula input",
      (event.target as HTMLInputElement).textContent
    );
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
}
