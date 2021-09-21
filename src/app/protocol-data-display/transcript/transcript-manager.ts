import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ProjectConfService } from 'src/app/project-conf/project-conf.service';
import {
  AssetLocation,
  SessionConfig,
} from 'src/app/project-conf/session-config.interface';
import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { DataSelection } from '../selection/data-selection';
import { RawTranscript } from './raw-transcript.interface';
import { Transcript } from './transcript';
import { Word } from './word/word';

export class TranscriptManager {
  transcript?: Transcript;
  loaded = new Subject<Transcript>();
  visibilityChanged = new Subject<Transcript>();
  config?: SessionConfig;
  saved = new Subject();
  debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private id: 'tap' | 'retro',
    private http: HttpClient,
    private configSvc: ProjectConfService,
    private labelFactory: LabelFactoryService
  ) {
    this.configSvc.sessionInfoChanged.subscribe((config) => {
      if (config) {
        this.config = config;
        this.load((config[`${this.id}Transcript`] as AssetLocation).download);
      }
    });
  }

  private async load(transcriptConfAddr: string) {
    let rawTranscript = await this.http
      .get<RawTranscript>(transcriptConfAddr)
      .toPromise();

    this.transcript = new Transcript(rawTranscript, this.labelFactory);

    // Wait before recreating selections to be sure labels have been loaded.
    // Not the best approach to achieve this.
    // TODO: Think of a better way that works
    // without circular dependencies and prevents racing conditions.
    setTimeout(() => {
      this.transcript && this.recreateDataSelections(this.transcript);
    }, 200);

    this.loaded.next(this.transcript);
  }

  /**
   * Recreates DataSelections from hibernated labeled transcript data
   * @param transcript
   */
  private recreateDataSelections(transcript: Transcript) {
    // 1. Find unique labels
    const labelIds = this.labelFactory.getAllLabelInstanceIds();

    // For all words in the transcript ...
    const words = ([] as Word[]).concat(
      ...transcript.paragraphs.map((p) => p.words)
    );

    // 2. Find groups of words that are assigned the same unique label
    // 3. Create selection for each group
    const selections: DataSelection[] = [];
    labelIds.forEach((id) => {
      const selection = words.filter((w) => w.hasLabelInstance(id));
      if (selection.length > 0)
        selections.push(
          new DataSelection(
            this.labelFactory.getLabelInstanceById(id),
            selection
          )
        );
    });

    // 4. Observe selections
    selections.forEach((s) => this.observeSelection(s));
  }

  private observeSelection(selection: DataSelection) {
    const visSub = selection.visibilityChanged.subscribe(() => {
      this.visibilityChanged.next(this.transcript);
    });
    const desSub = selection.destroyed.subscribe(() => {
      visSub.unsubscribe();
      desSub.unsubscribe();
    });
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
    if (this.config && this.transcript) {
      const t = this.transcript.toSerialisable();
      console.log(t);
      await this.http
        .post(
          (this.config[`${this.id}Transcript`] as AssetLocation).upload,
          this.transcript.toSerialisable()
        )
        .toPromise();
      this.saved.next();
    }
  }

  addLabelToCurrentSelection(label: LabelInstance) {
    // const self = this;
    const wordElems = TranscriptManager.getSelection();
    let words = wordElems.map((elem) => {
      const word = this.transcript!.getWordById(elem.id);
      return word;
    }) as Word[];
    words = words.filter((word: Word | undefined) => !!word);

    if (words.length) {
      const selection = new DataSelection(label, words);
      this.observeSelection(selection);
      this.save();
    }

    return words.length > 0;
  }

  static getSelection(): HTMLSpanElement[] {
    const selection = window.getSelection();
    const elements = [];
    try {
      if (selection && selection.rangeCount > 0) {
        const first = selection.getRangeAt(0).startContainer.parentNode as any;
        const last = selection.getRangeAt(0).endContainer.parentNode;
        if (first) {
          elements.push(first);
          while (elements[elements.length - 1] !== last)
            elements.push(
              elements[elements.length - 1].parentNode.nextElementSibling
                .firstChild
            );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      return elements.filter(
        (e) => e.tagName.toLowerCase() === 'span'
      ) as HTMLSpanElement[];
    }
  }

  // https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
  static clearSelection() {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection && selection.empty) {
        // Chrome
        selection.empty();
      } else if (selection && selection.removeAllRanges) {
        // Firefox
        selection.removeAllRanges();
      }
    }
  }
}
