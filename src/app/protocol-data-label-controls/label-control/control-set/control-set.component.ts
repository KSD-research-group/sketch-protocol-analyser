import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Label } from '../label';

@Component({
  selector: 'app-control-set',
  templateUrl: './control-set.component.html',
  styleUrls: ['./control-set.component.css'],
})
export class ControlSetComponent implements OnDestroy, OnInit {
  @Input() label?: Label;

  solo = false;
  muted = false;

  private labelSubs: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.label) {
      this.solo = this.label.solo;
      this.muted = this.label.muted;
      this.labelSubs = [
        this.label.soloChange.subscribe((l) => this.handleSoloChange(l)),
        this.label.muteChange.subscribe((l) => this.handleMuteChange(l)),
      ];
    }
  }

  ngOnDestroy(): void {
    this.labelSubs.forEach((s) => s.unsubscribe());
  }

  handleMuteChange(label: Label): void {
    this.muted = !!label.muted;
    console.log('muted', this.muted);
  }
  handleSoloChange(label: Label): void {
    this.solo = !!label.solo;
    console.log('solo', this.solo);
  }

  clickSolo(event: MouseEvent) {
    console.log(this.label);
    if (this.label) {
      this.label.toggleSolo();
    }
    event.stopPropagation();
  }

  clickMute(event: MouseEvent) {
    if (this.label) {
      this.label.toggleMute();
    }
    event.stopPropagation();
  }

  clickRemove(event: MouseEvent) {
    if (this.label) {
      this.label.remove();
    }
    event.stopPropagation();
  }
}
