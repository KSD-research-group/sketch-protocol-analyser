import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SelectType } from './sketch-controls.component';

@Injectable({
  providedIn: 'root',
})
export class SketchControlService {
  private rotation: number = 0;

  rotate = new Subject<number>();
  selectTypeChange = new BehaviorSubject<SelectType>(SelectType.STROKE);

  constructor() {}

  rotate90() {
    this.rotation += 90;
    // this.rotation %= 360;
    this.rotate.next(this.rotation);
  }

  setSelectType(type: SelectType) {
    this.selectTypeChange.next(type);
  }
}
