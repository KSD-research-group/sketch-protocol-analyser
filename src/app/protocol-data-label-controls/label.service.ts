import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { LabelType } from './label-control/label-type-control/label-type';
import { LabelInstance } from './label-control/label-instance-control/label-instance';
import { TranscriptService } from '../protocol-data-display/transcript/transcript.service';
import { SketchDataService } from '../protocol-data-display/sketch/sketch-data.service';
import { Label } from './label-control/label';
import { LabelGroup } from './label-group';
import { HttpClient } from '@angular/common/http';
import { RawLabelGroup } from './raw-label-group.interface';
import { ProjectConfService } from '../project-conf/project-conf.service';
import { RawLabel } from './label-control/raw-label.interface';
import { RawLabelInstance } from './label-control/label-instance-control/raw-label-instance.interface';
import { LabelFactoryService } from './label-factory.service';
import { SessionConfig } from '../project-conf/session-config.interface';
import { TranscriptManager } from '../protocol-data-display/transcript/transcript-manager';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  labelGroups: LabelGroup[] = [];
  loaded = new BehaviorSubject<LabelGroup[]>([]);

  instances: Record<string, LabelInstance> = {};
  instanceSubs: Record<string, Subscription[]> = {};

  types: Record<string, LabelType> = {};
  // typeSelected = new Subject<LabelType>();
  labelTypeSubs: Record<string, Subscription[]> = {};

  config?: SessionConfig;
  saved = new Subject();
  debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private http: HttpClient,
    private sketch: SketchDataService,
    private transcript: TranscriptService,
    private configSvc: ProjectConfService,
    private labelFactory: LabelFactoryService
  ) {
    this.configSvc.sessionInfoChanged.subscribe((config) => {
      if (config) {
        this.config = config;
        this.load(config.labels.download);
      }
    });
  }

  private async load(labelConfAddr: string) {
    const rawGroups = await this.http
      .get<RawLabelGroup[]>(labelConfAddr)
      .toPromise();

    this.labelGroups = rawGroups.map(
      (group) =>
        new LabelGroup(
          group.id,
          group.name,
          group.types.map((type) => this.defreezeType(type)),
          (group.instances &&
            group.instances.map((i) => this.defreezeInstance(i))) ||
            []
        )
    );

    // this.labelGroups.forEach((group) => {
    this.loaded.next(this.labelGroups);
    console.log('loaded', this.labelGroups);
  }

  private async save() {
    // Debounce:
    // - Wait for more updates before actually submiting
    // - Only send last update
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      this._save();
      this.debounceTimeout = null;
    }, 500);
  }

  private async _save() {
    if (this.config) {
      await this.http
        .post(
          this.config.labels.upload,
          this.labelGroups.map((g) => g.toSerialisable())
        )
        .toPromise();
      console.log(
        'Saved labels',
        this.labelGroups.map((g) => g.toSerialisable())
      );
      this.saved.next();
    }
  }

  private defreezeType(rawType: RawLabel): LabelType {
    const type = this.labelFactory.getLabelTypeByRaw(rawType);
    this.subscribeLabelTypeEvents(type);
    return type;
  }

  private subscribeLabelTypeEvents(label: LabelType) {
    if (!this.labelTypeSubs[label.id]) {
      this.labelTypeSubs[label.id] = [
        label.selected.subscribe((label) => this.addLabelToSelection(label)),
        label.removed.subscribe((label) => this.removeType(label)),
        label.muteChange.subscribe(() => this.save()),
        label.soloChange.subscribe(() => this.save()),
      ];
    }
  }

  addLabelToSelection(labelType: LabelType) {
    const groupId = labelType.id.split(':').slice(0, 4).join(':');
    const id = this.createLabelId(groupId, 'instance');
    const label = this.createInstanceIfNotExists(id, labelType);
    this.addLabelInstanceToSelection(label);
  }

  addLabelInstanceToSelection(label: LabelInstance) {
    const groupId = label.id.split(':').slice(0, 4).join(':');
    const group = this.labelGroups.find((group) => group.id === groupId);

    if (group) {
      let labelAdded = false;
      this.transcript
        .getAll()
        .forEach(
          (transMngr) =>
            (labelAdded ||= transMngr.addLabelToCurrentSelection(label))
        );
      labelAdded ||= this.sketch.addLabelToCurrentSelection(label);

      TranscriptManager.clearSelection();

      if (labelAdded && !group.instances.find((l) => l.id === label.id)) {
        group.instances.push(label);
        // this.instanceAdded.next(label);
        this.save();
      }
    }
  }

  private defreezeInstance(labelInstance: RawLabelInstance) {
    const instance = this.labelFactory.getLabelInstanceByRaw(labelInstance);
    this.subscribeLabelInstanceEvents(instance);
    return instance;
  }

  private createInstanceIfNotExists(id: string, labelType: LabelType) {
    const instance = this.labelFactory.createLabelInstanceIfNotExists(
      id,
      labelType.name,
      labelType.id
    );
    this.subscribeLabelInstanceEvents(instance);
    return instance;
  }

  private subscribeLabelInstanceEvents(label: LabelInstance) {
    if (!this.instanceSubs[label.id]) {
      this.instanceSubs[label.id] = [
        label.selected.subscribe((label: Label) => {
          this.addLabelInstanceToSelection(label as LabelInstance);
        }),
        label.removed.subscribe((label) => {
          this.removeInstance(label);
        }),
        label.muteChange.subscribe(() => this.save()),
        label.soloChange.subscribe(() => this.save()),
      ];
    }
  }

  private createLabelId(groupid: string, instanceOrType: 'instance' | 'type') {
    return `${groupid}:${instanceOrType}:${this.createRandomString()}`;
  }

  private createRandomString() {
    return Date.now().toString(32);
  }

  addType(name: string, groupId: string) {
    const group = this.labelGroups.find((g) => g.id === groupId);
    if (group) {
      const typeId = this.createLabelId(groupId, 'type');
      const type = this.labelFactory.createLabelTypeIfNotExists(typeId, name);
      group.types.push(type);
      this.subscribeLabelTypeEvents(type);
      this.save();
    }
  }

  removeType(label: Label) {
    this.labelTypeSubs[label.id].forEach((s) => s.unsubscribe());
    delete this.labelTypeSubs[label.id];
    this.removeLabelFromGroup(label, 'types');
  }

  removeInstance(label: Label) {
    this.instanceSubs[label.id].forEach((sub) => sub.unsubscribe());
    delete this.instanceSubs[label.id];
    this.removeLabelFromGroup(label, 'instances');
  }

  removeLabelFromGroup(label: Label, accessor: 'types' | 'instances') {
    const group = this.getGroupByLabel(label);

    if (group) {
      group[accessor].splice(
        group[accessor].findIndex((i) => i.id === label.id),
        1
      );
      this.save();
    }
  }

  private getGroupByLabel(label: Label) {
    const groupId = label.id.split(':').slice(0, 4).join(':');
    const group = this.labelGroups.find((group) => group.id === groupId);
    return group;
  }
}
