import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EasyStateManagerService {
  private _store: Store = {};

  public assignState(key: string, value: any, componentName?: string): void {
    if (componentName) {
      value = { value, componentName };
    }

    if ((key as string) in this._store) {
      this._store[key].next(value);
    } else {
      this._store[key] = new BehaviorSubject<any>(value);
    }
  }

  public getState(key?: string): any {
    if (key && (key as string) in this._store) {
      return this._store[key].value;
    }
    return null;
  }

  public selectStateChange(key: string): Observable<any> {
    if (key in this._store) {
      return this._store[key];
    }

    this._store[key] = new BehaviorSubject<any>(null);

    return this._store[key];
  }

  public deleteState(key: string): void {
    if (key in this._store) {
      delete this._store[key];
    }
  }
}

type Store = {
  [key: string]: BehaviorSubject<any> | string | any;
};
