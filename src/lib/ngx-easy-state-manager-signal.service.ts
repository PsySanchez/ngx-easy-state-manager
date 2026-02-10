import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EasyStateManagerServiceSignal {
  /**
   * Main store holding signals for each state key.
   * Wrapped in a signal to track adding/removing keys dynamically.
   */
  private readonly _store = signal<Record<string, WritableSignal<any>>>({});

  /**
   * Sets or updates state for a specific key.
   * Implements immutable update logic for objects and arrays to ensure change detection.
   * @param key Unique identifier for the state slice.
   * @param value New value to assign or merge.
   */
  public assignState<T>(key: string, value: T): void {
    const currentStore = this._store();
    const existingSignal = currentStore[key];

    if (existingSignal) {
      // If signal exists, update its value using immutable patterns
      existingSignal.update(oldValue => {
        if (Array.isArray(value)) return [...value];
        if (value !== null && typeof value === 'object') {
          return { ...oldValue, ...value };
        }
        return value;
      });
    } else {
      // Create a new signal and trigger store structure update
      const newSignal = signal(value);
      this._store.update(store => ({
        ...store,
        [key]: newSignal
      }));
    }
  }

  /**
   * Returns a "resilient" Read-only signal for a specific key.
   * It tracks the store structure: if a key is deleted and recreated, 
   * the subscriber automatically reconnects to the new signal.
   * @param key Key to watch.
   */
  public selectStateChange<T>(key: string): Signal<T | null> {
    return computed(() => {
      // Subscribes to the store's dictionary changes
      const s = this._store()[key];
      // Returns signal value if key exists, otherwise null
      return s ? s() : null;
    });
  }

  /**
   * Returns a current snapshot of the state without subscription.
   */
  public getState<T>(key: string): T | null {
    const s = this._store()[key];
    return s ? s() : null;
  }

  /**
   * Removes a key from the store.
   * All subscribers to this key will immediately receive 'null'.
   */
  public deleteState(key: string): void {
    if (this._store()[key]) {
      this._store.update(store => {
        const newStore = { ...store };
        delete newStore[key];
        return newStore;
      });
    }
  }

  /**
   * Resets the entire store to an empty state.
   */
  public clearAll(): void {
    this._store.set({});
  }
}
