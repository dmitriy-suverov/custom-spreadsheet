export type TABLE_ACTIONS = typeof TABLE_RESIZE | typeof CHANGE_TEXT;

const TABLE_RESIZE = "TABLE_RESIZE" as const;
export function resizeAction(data: {
  type: "col" | "row";
  value: any;
  id: number;
}) {
  return {
    type: TABLE_RESIZE,
    payload: data
  };
}

const CHANGE_TEXT = "CHANGE_TEXT" as const;
export function changeTextAction(payload: { [key: string]: string }) {
  return {
    type: CHANGE_TEXT,
    payload
  };
}
