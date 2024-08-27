import {
  Injectable,
  signal,
  computed,
  Signal,
  effect,
  Injector,
  inject,
  runInInjectionContext,
} from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EasyStateManagerServiceSignal {
  private _store: { [key: string]: Signal<any> } = {};
  private injector = inject(Injector);

  public getState<T>(key?: string): any {
    if (key && (key as string) in this._store) {
      return this._store[key]() as T;
    }
    return undefined;
  }

  public assignState<T>(key: string, value: T): void {
    if ((key as string) in this._store) {
      this._store[key] = computed(() => value);
    } else {
      this._store[key] = signal<T>(value);
    }
  }

  public selectStateChange(key: string): Observable<any> {
    return new Observable((observer) => {
      runInInjectionContext(this.injector, () => {
        effect(() => {
            console.log(this._store[key]);
          observer.next(this._store[key]);
        });
      });
    });
  }
}
