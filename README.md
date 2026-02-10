## ngx-easy-state-manager

![Example Image](https://github.com/PsySanchez/ngx-easy-state-manager/blob/master/ngx-easy-state-manager.jpg)

`ngx-easy-state-manager` is a lightweight, intuitive library for managing state in Angular applications. It simplifies state management by providing a straightforward API for creating, updating, and accessing state, without the complexity of traditional approaches.

## Installation

```bash
npm install ngx-easy-state-manager
```

## Versions

| Version | Option                                        |
| ------- | --------------------------------------------- |
| ^0.0.4  | Angular 19.                                   |
| ^1.0.0  | Added angular support from ^18.0.0 to ^21.0.0,|
|         | and converted to use signals.                 |

## Usage

EasyStateManagerService (Signals Version)
A lightweight and resilient state management service for Angular using Signals. It supports dynamic keys, immutable updates, and persistent subscriptions.

1. **Import the EasyStateManagerService**
This library now supports Angular Signals for better performance. However, the classic Observable-based version is still available for backward compatibility.

Signals Version (Recommended for Angular 16+)

app.module.ts

```typescript
import { EasyStateManagerService } from "ngx-easy-state-manage";

@NgModule({
  providers: [EasyStateManagerService], // Simplified registration
})
export class AppModule {}
```
Observable Version (Classic)
If you prefer using RxJS Observables, use the original service:

```typescript
import { EasyStateManagerService } from "ngx-easy-state-manage";

@NgModule({
  providers: [EasyStateManagerService],
})
export class AppModule {}
```

2. **Inject the Service**
   Inject the service into your component or another service:

```typescript
constructor(private easyStateManager: EasyStateManagerService) {}
```

3. **Assign State**
   Create or update state using assignState. It automatically handles Immutable updates for objects and arrays (creating new references to trigger change detection).

```typescript
// Assign a primitive
this.easyStateManager.assignState("title", "My App");

// Assign/Update an object (performs a shallow merge)
this.easyStateManager.assignState("user", { id: 1, name: "John" });
```

4. **Retrieve State (Snapshot)**
   To get the current value of a state key once (without subscription), use getState:

```typescript
const currentTitle = this.easyStateManager.getState<string>("title");
console.log(currentTitle); // Output: 'My App'
```

5. **Subscribe to State Changes (Signals)**
   The selectStateChange method returns a Read-only Signal. It is "resilient": if you delete the key and recreate it later, the signal will automatically reconnect and provide the new values.

```typescript
// In your component
public title = this.easyStateManager.selectStateChange<string>("title");

constructor() {
  effect(() => {
    console.log("Title updated:", this.title());
  });
}
```

In your HTML template:

```html
<h1>{{ title() || 'Loading...' }}</h1>
```

6. **Delete State**

To remove a state key. All active subscribers to this key will immediately receive null.

```typescript
this.easyStateManager.deleteState("title");
```

7. **Clear All**
   To reset the entire store and notify all active subscribers.

```typescript
this.easyStateManager.clearAll();
```

## API

assignState<T>(key: string, value: T): void
Assigns a value to the state.
Immutable updates: If the value is an object or an array, the service creates a new reference (shallow copy) to ensure Angular's change detection is triggered.
Dynamic: If the key doesn't exist, it will be created.
selectStateChange<T>(key: string): Signal<T | null>
Returns a Read-only Signal for the specified key.
Resilient: If the state is deleted and then recreated with the same key, this signal will automatically "reconnect" to the new value.
Reactive: Perfect for use in templates or effect(). Returns null if the key does not exist or was deleted.
getState<T>(key: string): T | null
Retrieves a snapshot of the current value associated with the specified key.
Does not create a subscription.
Returns null if the key is not found.
deleteState(key: string): void
Removes the state associated with the specified key.
All active signals created via selectStateChange for this key will be updated to null.
clearAll(): void
Completely resets the store.
All keys are removed, and all active subscribers are notified with null.


| Feature | EasyStateManagerServiceSignal | EasyStateManagerService |
| :--- | :--- | :--- |
| **Reactive Type** | Signal | Observable |
| **Update Logic** | Immutable (Shallow Copy) | Direct / Manual |
| **Resilience** | Reconnects after deleteState | Subscription ends on delete* |
| **Template Usage** | `{{ state() }}` | `{{ state$ \| async }}` |


Note: The new EasyStateManagerServiceSignal is specifically designed to work with Angular's new reactivity model.
 It provides "resilient" connections, meaning if a key is deleted and recreated, your UI components will automatically pick up the new value without needing to re-subscribe.

## Example

stateTypes.ts

```typescript
export const SELECTED_EMOJI = "selectedEmoji";

export interface EmojiState {
  emoji: string;
}
```

app.compoinent

```typescript
import { Component, effect, Signal } from "@angular/core";
import { EmojiPicker } from "ngx-easy-emoji-picker";
import { EasyStateManagerService } from "ngx-easy-state-manage";
import { SELECTED_EMOJI, EmojiState } from "./stateTypes";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [EmojiPicker],
  template: `
    <!-- Direct usage of signal in template -->
    <div class="display">Selected: {{ emojiState()?.emoji || "None" }}</div>

    <ngx-easy-emoji-picker (onEmojiSelected)="onEmojiSelected($event)">
    </ngx-easy-emoji-picker>
  `,
  // Service is providedIn: 'root', but can be added to providers if needed locally
})
export class AppComponent {
  // 1. Get a Read-only Signal for the state
  public emojiState: Signal<EmojiState | null>;

  constructor(private _stateManager: EasyStateManagerService) {
    this.emojiState =
      this._stateManager.selectStateChange<EmojiState>(SELECTED_EMOJI);

    // 2. React to changes in logic (optional)
    effect(() => {
      const current = this.emojiState();
      if (current) {
        console.log("Emoji updated in state:", current.emoji);
      }
    });
  }

  onEmojiSelected(emoji: string) {
    // 3. Assign new state (it will trigger the signal above)
    this._stateManager.assignState(SELECTED_EMOJI, { emoji: emoji });
  }

  removeEmoji() {
    // 4. Delete state - emojiState() will automatically become 'null'
    this._stateManager.deleteState(SELECTED_EMOJI);
  }
}
```

## License

This project is licensed under the MIT License.
