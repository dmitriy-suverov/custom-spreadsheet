export type HEADER_ACTIONS = typeof RENAME_TABLE;

const RENAME_TABLE = "RENAME_TABLE" as const;
export function renameTableAction(newName: string) {
  return {
    type: RENAME_TABLE,
    payload: {
      newName
    }
  };
}
