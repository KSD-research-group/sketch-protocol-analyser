import { ElementRef } from '@angular/core';
import { Speaker } from '../speaker.interface';
import { Word } from '../word/word';

export class Paragraph {
  element?: ElementRef;
  constructor(
    public speaker: Speaker,
    public words: Word[],
    public labels: string[]
  ) {}
}
