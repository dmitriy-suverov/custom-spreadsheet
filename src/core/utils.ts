export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getMethodName(eventName: keyof HTMLElementEventMap): string {
  return `on${capitalize(eventName)}`;
}
