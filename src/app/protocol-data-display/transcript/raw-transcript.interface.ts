import { RawWord } from "./word/raw-word.interface";
import { Meta } from "./meta.interface";


export interface RawTranscript {
  meta: Meta;
  data: RawWord[];
}
