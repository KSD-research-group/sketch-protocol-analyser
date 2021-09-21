import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private keyState: Record<string, boolean> = {};

  down = new Subject<string>();
  up = new Subject<string>();
  event = new Subject<string>();

  constructor() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e: KeyboardEvent): any {
    this.keyState[e.key] = true;
    this.down.next(e.key);
    this.event.next(e.key);
  }

  handleKeyUp(e: KeyboardEvent): any {
    this.keyState[e.key] = false;
    this.up.next(e.key);
    this.event.next(e.key);
  }

  isPressed(keyName: string) {
    return this.keyState[keyName] || false;
  }
}
