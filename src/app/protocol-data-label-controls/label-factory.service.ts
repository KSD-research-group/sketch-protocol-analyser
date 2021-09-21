import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LabelInstance } from './label-control/label-instance-control/label-instance';
import { RawLabelInstance } from './label-control/label-instance-control/raw-label-instance.interface';
import { LabelType } from './label-control/label-type-control/label-type';
import { RawLabel } from './label-control/raw-label.interface';

@Injectable({
  providedIn: 'root',
})
export class LabelFactoryService {
  types: Record<string, LabelType> = {};
  instances: Record<string, LabelInstance> = {};

  changed = new Subject();

  constructor() {}

  getLabelTypeByRaw(raw: RawLabel) {
    if (!this.types[raw.id]) {
      this.types[raw.id] = LabelType.fromRaw(raw);
      this.subscribeType(this.types[raw.id]);
      this.notifyChange();
    }
    return this.types[raw.id];
  }

  getLabelTypeById(id: string) {
    return this.types[id];
  }

  createLabelTypeIfNotExists(id: string, name: string) {
    if (!this.types[id]) {
      this.types[id] = new LabelType(id, name);
      this.subscribeType(this.types[id]);
      this.notifyChange();
    }
    return this.types[id];
  }

  private subscribeType(type: LabelType) {
    const sub = type.removed.subscribe(() => {
      sub.unsubscribe();
      delete this.types[type.id];
      this.notifyChange();

      // Remove all instances of type
      for (let key in this.instances) {
        if (this.instances[key].typeId === type.id) {
          this.instances[key].remove(); // Will invoke remove event
        }
      }
    });
  }

  getLabelInstanceById(id: string) {
    return this.instances[id];
  }

  getLabelInstanceByRaw(raw: RawLabelInstance) {
    if (!this.instances[raw.id]) {
      this.instances[raw.id] = LabelInstance.fromRaw(raw, this);
      this.subscribeInstance(this.instances[raw.id]);
      this.notifyChange();
    }
    return this.instances[raw.id];
  }

  createLabelInstanceIfNotExists(id: string, name: string, typeId: string) {
    if (!this.instances[id]) {
      this.instances[id] = new LabelInstance(id, name, typeId, this);
      this.subscribeInstance(this.instances[id]);
      this.notifyChange();
    }
    return this.instances[id];
  }

  getAllLabelInstanceIds(): string[] {
    return Object.keys(this.instances);
  }

  private notifyChange() {
    setTimeout(() => this.changed.next(), 200);
    // this.changed.next()
  }

  private subscribeInstance(instance: LabelInstance) {
    const sub = instance.removed.subscribe(() => {
      console.log('Remove instance', instance);
      sub.unsubscribe();
      delete this.instances[instance.id];
      this.notifyChange();
    });
  }
}
