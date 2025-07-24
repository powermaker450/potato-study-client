/*
 * potato-study-client: The official client for potato-study
 * Copyright (C) 2025  povario
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
