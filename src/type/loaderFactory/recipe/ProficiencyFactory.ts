import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { Proficiency } from 'src/type/loader/recipe/ProficiencyLoader';
import { SuperFactory } from '../SuperFactory';

export class ProficiencyFactory extends SuperFactory {
  loaders = [new Proficiency()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.proficiency;
  }
}
