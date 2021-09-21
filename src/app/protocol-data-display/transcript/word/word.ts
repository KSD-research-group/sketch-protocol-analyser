import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { Selectable } from '../../selection/selectable';
import { RawWord } from './raw-word.interface';

export class Word extends Selectable {
  static newId = generateId();

  id: string;
  text: string;
  time: number;
  speaker: string;

  constructor(word: RawWord, labelFac: LabelFactoryService) {
    super(
      labelFac,
      word.labels || [],
      !!word.selected,
      !!word.muted,
      !!word.solo
    );
    this.id = Word.newId.next().value;
    this.text = word.text;
    this.speaker = word.speaker;
    this.time = word.time;
  }

  toSerialisable(): RawWord {
    return {
      // id: this.id,
      text: this.text,
      speaker: this.speaker,
      time: this.time,
      labels: this.labels || ([] as string[]),
    };
  }
}

function* generateId(): Generator<string> {
  let seed = 0;
  while (true) {
    yield `urn:sketch:transcript:word:${seed++}`;
  }
}
