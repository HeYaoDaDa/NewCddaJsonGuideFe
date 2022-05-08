import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { SubBodyPart } from 'src/type/loader/baseLoader/bodyPart/SubBodyPartLoader';
import { SuperFactory } from '../SuperFactory';

export class SubBodyFactory extends SuperFactory {
  loaders = [new SubBodyPart()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.subBodyPart;
  }
}
