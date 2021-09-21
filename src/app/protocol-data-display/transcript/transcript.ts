import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { LabelService } from 'src/app/protocol-data-label-controls/label.service';
import { Meta } from './meta.interface';
import { Paragraph } from './paragraph/paragraph';
import { RawTranscript } from './raw-transcript.interface';
import { Speaker } from './speaker.interface';
import { RawWord } from './word/raw-word.interface';
import { Word } from './word/word';

export class Transcript {
  meta: Meta;
  paragraphs: Paragraph[] = [];

  constructor(
    rawTranscript: RawTranscript,
    private labelFactory: LabelFactoryService
  ) {
    this.meta = rawTranscript.meta;

    let lastSpeaker: string | null = null;
    rawTranscript.data.forEach((word: RawWord) => {
      if (word.speaker !== lastSpeaker) {
        lastSpeaker = word.speaker;
        const speaker = rawTranscript.meta.speakers.find(
          (s) => s.id === lastSpeaker
        );
        this.paragraphs.push(new Paragraph(speaker as Speaker, [], []));
      }
      this.paragraphs[this.paragraphs.length - 1].words.push(
        new Word(word, this.labelFactory)
      );
    });
  }

  getWordById(id: string): Word | undefined {
    let word;
    this.paragraphs.forEach((p) => {
      const w = p.words.find((w) => id === w.id);
      if (w) {
        word = w;
      }
    });
    return word;
  }

  toSerialisable(): RawTranscript {
    return {
      meta: this.meta,
      data: ([] as RawWord[]).concat(
        ...this.paragraphs.map((p) => p.words.map((w) => w.toSerialisable()))
      ),
    };
  }
}
