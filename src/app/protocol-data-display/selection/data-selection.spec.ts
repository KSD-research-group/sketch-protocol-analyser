import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { LabelType } from 'src/app/protocol-data-label-controls/label-control/label-type-control/label-type';
import { DataSelection } from './data-selection';

describe('Selection', () => {
  it('should create an instance', () => {
    expect(
      new DataSelection(
        new LabelInstance('id', 'name', new LabelType('typeid', 'name')),
        []
      )
    ).toBeTruthy();
  });
});
