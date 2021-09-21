import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { Selectable } from './selectable';

describe('Selectable', () => {
  it('should create an instance', () => {
    expect(new Selectable(new LabelFactoryService())).toBeTruthy();
  });
});
