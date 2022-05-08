import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { BodyPart } from 'src/type/loader/baseLoader/bodyPart/BodyPartLoader';
import { SuperFactory } from '../SuperFactory';

export class BodyFactory extends SuperFactory {
  loaders = [new BodyPart()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.bodyPart;
  }
}
