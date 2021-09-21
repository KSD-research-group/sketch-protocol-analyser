import { A } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { LabelService } from 'src/app/protocol-data-label-controls/label.service';
import { Paragraph } from './paragraph';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.css'],
})
export class ParagraphComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() paragraph?: Paragraph;
  @ViewChild('container') node?: ElementRef;

  labelChngSub: Subscription;

  constructor(private labelFac: LabelFactoryService) {
    this.labelChngSub = this.labelFac.changed.subscribe(() => {
      this.handleLabelChange();
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.paragraph) {
      this.paragraph.element = this.node;
    }
  }

  ngOnDestroy() {
    // this.labelAddSub.unsubscribe();
    this.labelChngSub.unsubscribe();
    console.log('destroy');
  }

  handleLabelChange() {
    // console.log('handleLabelChange');
    if (this.paragraph) {
      // Get all labels for words in this paragraph and remove duplicates
      // --> Sort by label instance ID and remove all items that have the same ID as predecessor
      this.paragraph.labels = ([] as string[])
        .concat(...this.paragraph.words.map((word) => word.labels))
        .sort()
        .filter((label, pos, labels) => {
          return !pos || label != labels[pos - 1];
        });
    }
  }
}
