export class CellParser {
  public static parse(value: string) {
    if (value.startsWith("=")) {
      try {
        return eval(value.slice(1));
      } catch (error) {
        console.warn(`Parsing error, skipping: ${value}`);
        return value;
      }
    }
    return value;
  }
}
