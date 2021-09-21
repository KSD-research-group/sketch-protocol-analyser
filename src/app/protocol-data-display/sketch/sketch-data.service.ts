import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectConfService } from 'src/app/project-conf/project-conf.service';
import { SessionConfig } from 'src/app/project-conf/session-config.interface';
import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { DataSelection } from '../selection/data-selection';
import { Point } from './point';
import { RawPoint } from './raw-point';
import { Sketch } from './sketch';

@Injectable({
  providedIn: 'root',
})
export class SketchDataService implements OnDestroy {
  private sketch?: Sketch;
  private points: Point[] = [];

  config?: SessionConfig;
  newdata = new Subject<void>();
  change = new Subject<Point[][]>();
  visibilityChanged = new Subject<void>();
  saved = new Subject<void>();
  debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private http: HttpClient,
    private configSvc: ProjectConfService,
    private labelFac: LabelFactoryService
  ) {
    this.configSvc.sessionInfoChanged.subscribe((config) => {
      if (config) {
        this.config = config;
        this.loadSketch(config.sketch.download);
      }
    });
  }

  ngOnDestroy() {}

  getStrokes(): Sketch | [] {
    return this.sketch || [];
  }

  getPoints(): Point[] {
    return this.points;
  }

  async loadSketch(sketchConfAddr: string): Promise<void> {
    const rawStrokes = await this.http
      .get<RawPoint[][]>(sketchConfAddr)
      .toPromise();

    this.sketch = Sketch.fromRawStrokes(rawStrokes, this.labelFac);

    console.log(`strokes ${this.sketch.length}`);

    // Wait before recreating selections to be sure labels have been loaded.
    // Not the best approach to achieve this.
    // TODO: Think of a better way that works
    // without circular dependencies and prevents racing conditions.
    setTimeout(() => {
      this.recreateDataSelections();
    }, 200);

    this.update();
    this.newdata.next();
  }

  private async save() {
    // Debounce:
    // - Wait for more updates before actually submiting
    // - Only send latest version
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      this._save();
      this.debounceTimeout = null;
    }, 600);
  }

  private async _save() {
    if (this.config && this.sketch) {
      const t = this.sketch.toSerialisable();
      console.log(t);
      await this.http
        .post(this.config.sketch.upload, this.sketch.toSerialisable())
        .toPromise();
      this.saved.next();
    }
  }

  /**
   * Recreates DataSelections from hibernated labeled sketch data
   */
  private recreateDataSelections() {
    // 1. Find unique labels
    const labelIds = this.labelFac.getAllLabelInstanceIds();

    // 2. Find groups of words that are assigned the same unique label
    // 3. Create selection for each group
    const selections: DataSelection[] = [];
    labelIds.forEach((id) => {
      const selection = this.points.filter((p) => p.hasLabelInstance(id));
      if (selection.length > 0)
        selections.push(
          new DataSelection(this.labelFac.getLabelInstanceById(id), selection)
        );
    });

    // 4. Observe selections
    selections.forEach((s) => this.observeSelection(s));
  }

  private observeSelection(selection: DataSelection) {
    const visSub = selection.visibilityChanged.subscribe(() => {
      this.visibilityChanged.next();
      // this.save();
    });
    const desSub = selection.destroyed.subscribe(() => {
      visSub.unsubscribe();
      desSub.unsubscribe();
      this.save();
    });
  }

  private getSelectedPoints(): Point[] {
    if (this.sketch) {
      return ([] as Point[]).concat(...this.sketch).filter((p) => p.selected);
    } else {
      return [];
    }
  }

  addLabelToCurrentSelection(label: LabelInstance) {
    const points = this.getSelectedPoints();

    if (points.length) {
      const selection = new DataSelection(label, points);
      this.observeSelection(selection);
      this.save();
    }

    // Clear select state so points do not get labeled accidentally twice
    this.clearSelection();

    return points.length > 0;
  }

  private clearSelection() {
    this.sketch &&
      ([] as Point[])
        .concat(...this.sketch)
        .forEach((p) => (p.selected = false));
    this.update();
  }

  toggleSelectState(points: Point[]) {
    points.forEach((p) => (p.selected = !p.selected));
    this.update();
  }

  setSelectState(points: Point[], state: boolean) {
    points.forEach((p) => (p.selected = state));
    this.update();
  }

  selectAll(filter?: Function) {
    let points = this.points;
    if (typeof filter === 'function') {
      points = points.filter((p) => filter(p));
    }
    this.setSelectState(points, true);
  }

  unselectAll() {
    this.setSelectState(this.points, false);
  }

  private update() {
    if (this.sketch) {
      this.points = ([] as Point[]).concat(
        ...([] as Point[]).concat(...this.sketch)
      );
      this.change.next(this.sketch);
    }
  }
}
