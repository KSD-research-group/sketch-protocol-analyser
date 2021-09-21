import { Subject, Subscription } from 'rxjs';
import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { Selectable } from './selectable';

export class DataSelection {
  private subs: Subscription[] = [];

  /**
   * Is fired if visibility of any of the items in this selection changes.
   */
  visibilityChanged = new Subject<void>();

  /**
   * Is fired if this selection is destroyed. Typically when the respective label instance is removed.
   */
  destroyed = new Subject<void>();

  constructor(private label: LabelInstance, private selectables: Selectable[]) {
    this.selectables.forEach((d) => d.addLabel(label));
    this.subs.push(label.muteChange.subscribe(() => this.changeMute()));
    this.subs.push(label.soloChange.subscribe(() => this.changeSolo()));
    this.subs.push(label.removed.subscribe(() => this.destroy()));
    this.setVisability('muted');
    this.setVisability('solo');
    console.log('New DataSelection', this);
  }

  private changeMute() {
    this.setVisability('muted');
  }

  private changeSolo() {
    this.setVisability('solo');
  }

  private setVisability(selector: 'muted' | 'solo') {
    let visChanged = false;
    this.selectables.forEach((d) => {
      visChanged = d.evalVisibilityChange(selector);
    });

    if (visChanged) {
      console.log('Vis changed');
      this.visibilityChanged.next();
    }
  }

  destroy() {
    console.log('destroy');
    this.selectables.forEach((p) => p.removeLabel(this.label));
    this.setVisability('muted');
    this.setVisability('solo');
    this.subs.forEach((s) => s.unsubscribe());
    this.destroyed.next();
  }
}
