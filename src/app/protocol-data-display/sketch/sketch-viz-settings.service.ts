import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SketchVizSettingsService {

  width = 500;
  height = 500;

  constructor() { }
}
