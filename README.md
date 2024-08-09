## ngx-easy-state-manager

<!-- ![Example Image](https://github.com/PsySanchez/ngx-easy-emoji-picker/blob/master/src/emoji-picker.png) -->

`ngx-easy-state-manager` is a lightweight, intuitive library for managing state in Angular applications. It simplifies state management by providing a straightforward API for creating, updating, and accessing state, without the complexity of traditional approaches.

## Installation

```bash
npm install ngx-easy-state-manager
```

## Usage

1. **Import the EasyStateManagerService**
   First, import the EasyStateManagerService into your component or service where you want to manage the state.

app.module.ts

```typescript
import { EasyStateManagerService } from "ngx-easy-state-manage";

@NgModule({
  providers: [{ provide: EasyStateManagerService }],
})
export class AppModule {}
```

2. **Inject the Service**
   Inject EasyStateManagerService in the constructor of your component or service.

```typescript
constructor(private easyStateManager: EasyStateManagerService) {}
```

3. **Assign State**
   You can assign a new state using the assignState method. Optionally, you can also associate the state with a specific component name.

```typescript
this.easyStateManager.assignState("exampleKey", "exampleValue", "ExampleComponentName");
```

4. **Retrieve State**
   To get the current state associated with a specific key, use the getState method.

```typescript
const currentState = this.easyStateManager.getState("exampleKey");
console.log(currentState); // Output: 'exampleValue'
```

5. **Subscribe to State Changes**
   You can subscribe to state changes using the selectStateChange method, which returns an Observable.

```typescript
this.easyStateManager.selectStateChange("exampleKey").subscribe((newValue) => {
  console.log("State has changed:", newValue);
});
```

6. **Delete State**
   To delete a state associated with a specific key, use the deleteState method.

```typescript
this.easyStateManager.deleteState("exampleKey");
```

## API

assignState(key: string, value: any, componentName?: string): void
Assigns a value to the state with an optional component name.

getState(key?: string): any
Retrieves the current value of the state associated with the specified key.

selectStateChange(key: string): Observable<any>
Returns an Observable that emits whenever the state associated with the specified key changes.

deleteState(key: string): void
Deletes the state associated with the specified key.

## Example

stateTypes

```typescript
export const SELECTED_EMOJI = "selectedEmoji";
```

app.compoinent

```typescript
import { Component, OnInit } from "@angular/core";
import { EmojiPicker } from "ngx-easy-emoji-picker";
import { EasyStateManagerService } from "ngx-easy-state-manager";

import { SELECTED_EMOJI } from "./stateTypes";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [EmojiPicker],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  providers: [EasyStateManagerService],
})
export class AppComponent implements OnInit {
  title = "my-project";

  selectedEmoji = "";

  constructor(private _stateManager: EasyStateManagerService) {}

  ngOnInit() {
    this._stateManager.selectStateChange(SELECTED_EMOJI).subscribe((state) => {
      if (state) this.selectedEmoji = state.emoji;

      console.log("Selected emoji:", this.selectedEmoji);
    });
  }

  onEmojiSelected(emoji: string) {
    this._stateManager.assignState(SELECTED_EMOJI, { emoji: emoji });
  }
}
```

## License

This project is licensed under the MIT License.
