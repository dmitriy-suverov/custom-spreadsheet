import { Router } from "./router";

export class ActiveRouteService {
  static get path() {
    return window.location.hash.slice(1);
  }

  static get param() {
    return ActiveRouteService.path.split("/")[1];
  }

  static navigate(to: keyof Router["routes"]) {
    window.location.hash = `#${to}`;
  }
}
