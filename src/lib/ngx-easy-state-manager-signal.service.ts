import {
  Injectable,
  signal,
  computed,
  Signal,
  WritableSignal,
} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EasyStateManagerServiceSignal {
  private _store: Store = {};

  constructor() {}

  public getState<T>(key?: string): any {
    if (key && (key as string) in this._store) {
      return this._store[key]() as T;
    }
    return undefined;
  }

  public assignState<T>(key: string, value: T): void {
    if ((key as string) in this._store) {
      const storeValue = this._store[key]() as T;
      // check type mismatch
      if (storeValue && typeof storeValue !== typeof value) {
        throw new Error(
          `Type mismatch: ${typeof storeValue} !== ${typeof value}`
        );
      }

      this._store[key].set(value);
    } else {
      this._store[key] = signal<T>(value);
    }
  }

  public selectStateChange<T>(key: string): Signal<T> {
    if (!(key in this._store)) {
      this._store[key] = signal<T>(null as T);
    }

    return computed(() => this._store[key]() as T);
  }
}

type Store = { [key: string]: WritableSignal<any> };
