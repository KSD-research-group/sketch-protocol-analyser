import { Subject } from 'rxjs';
import { RawLabel } from './raw-label.interface';

export abstract class Label {
  selected = new Subject<Label>();
  muteChange = new Subject<Label>();
  soloChange = new Subject<Label>();
  removed = new Subject<Label>();

  // _muted: boolean = false;
  // _solo: boolean = false;

  get muted(): boolean {
    return this._muted || false;
  }

  set muted(muted: boolean) {
    if (muted !== this._muted) {
      this._muted = muted;
      console.log('Mute changed', this);
      this.muteChange.next(this as Label);
    }
  }

  get solo(): boolean {
    return this._solo || false;
  }

  set solo(solo: boolean) {
    if (this._solo !== solo) {
      this._solo = solo;
      console.log('Solo changed', this);
      this.soloChange.next(this as Label);
    }
  }

  constructor(public id: string, public name: string, private _muted: boolean, private _solo: boolean) {}

  toggleSolo() {
    console.log('Toggle solo', this);
    this.solo = !this.solo;
    if (this.solo) {
      this.unmute();
    }
  }

  unsolo() {
    if (this.solo) {
      this.solo = false;
    }
  }

  toggleMute() {
    console.log('Toggle mute', this);
    this.muted = !this.muted;
    if (this.muted) {
      this.unsolo();
    }
  }

  unmute() {
    if (this.muted) {
      this.muted = false;
    }
  }

  remove() {
    this.removed.next(this);
  }

  select() {
    this.selected.next(this);
  }

  toSerialisable(): RawLabel {
    return {
      id: this.id,
      name: this.name,
      muted: !!this.muted,
      solo: !!this.solo,
    };
  }
}
