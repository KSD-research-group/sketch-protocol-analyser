import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css'],
})
export class FileSelectorComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input('filetype') filetype!: string;
  @Output() change = new EventEmitter<File>();

  uploadUrl?: string;
  selected = false;
  loading = false;
  loaded = false;
  file?: File;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onFileInput() {
    this.file = this.fileInput.nativeElement.files[0];
    this.selected = !!this.file;
    this.loading = false;
    this.loaded = false;
    this.change.emit(this.file);
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  async upload() {
    if (this.file && this.uploadUrl) {
      const formData = new FormData();
      formData.append('file', this.file);
      await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData,
      });
      this.loaded = true;
      this.loading = false;
      this.change.emit(this.file);
    }
  }
}
