import { DEFAULT_STYLES } from "../constants";

export type TOOLBAR_ACTIONS = typeof APPLY_STYLE | typeof CURRENT_STYLE;

const CURRENT_STYLE = "CURRENT_STYLE" as const;

export function currentStylesAction(styles: typeof DEFAULT_STYLES) {
  return {
    type: CURRENT_STYLE,
    payload: styles
  };
}

const APPLY_STYLE = "APPLY_STYLE" as const;

export function applyStyleAction(cellIds: string[], value: Partial<CSSStyleDeclaration>) {
  return {
    type: APPLY_STYLE,
    payload: {
      cellIds,
      value
    }
  };
}
