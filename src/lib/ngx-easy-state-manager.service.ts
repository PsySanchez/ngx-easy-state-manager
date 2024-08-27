import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EasyStateManagerService {
  private _store: Store = {};

  public assignState<T>(key: string, value: T): void {
    if ((key as string) in this._store) {
      const storeValue = this._store[key].value;
      // check type mismatch
      if (storeValue && typeof storeValue !== typeof value) {
        throw new Error(
          `Type mismatch: ${typeof this._store[key].value} !== ${typeof value}`
        );
      }

      this._store[key].next(value);
    } else {
      this._store[key] = new BehaviorSubject<T>(value);
    }
  }

  public getState<T>(key?: string): T | undefined {
    if (key && (key as string) in this._store) {
      return this._store[key].value;
    }
    return undefined;
  }

  public selectStateChange<T>(key: string): BehaviorSubject<any> {
    if (key in this._store) {
      return this._store[key] as BehaviorSubject<T>;
    }

    this._store[key] = new BehaviorSubject<T>(null as T);

    return this._store[key];
  }

  public deleteState(key: string): void {
    if (key in this._store) {
      delete this._store[key];
    }
  }
}

type Store = {
  [key: string]: BehaviorSubject<any>;
};
