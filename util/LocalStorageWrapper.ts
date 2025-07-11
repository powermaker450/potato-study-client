import type LocalStorageKey from "./LocalStorageKey";

class Wrapper implements Storage {
  public getItem(key: LocalStorageKey): string | null {
    return localStorage.getItem(key);
  }

  public setItem(key: LocalStorageKey, value: string): void {
    return localStorage.setItem(key, value);
  }

  public removeItem(key: LocalStorageKey): void {
    return localStorage.removeItem(key);
  }

  public clear(): void {
    return localStorage.clear();
  }

  public key(index: number): LocalStorageKey | null {
    return localStorage.key(index) as LocalStorageKey | null;
  }

  public get length(): number {
    return localStorage.length;
  }
}

const LocalStorageWrapper = new Wrapper();

export default LocalStorageWrapper;
