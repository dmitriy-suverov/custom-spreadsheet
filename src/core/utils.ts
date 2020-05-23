export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getMethodName(eventName: keyof HTMLElementEventMap): string {
  return `on${capitalize(eventName)}`;
}

export function getFromStorage<T = any>(key: string): T {
  return JSON.parse(localStorage.getItem(key));
}

export function setToStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function isEqual(first: any, second: any): boolean {
  if (typeof first === "object" && typeof second === "object") {
    return JSON.stringify(first) === JSON.stringify(second);
  }
  return first === second;
}
