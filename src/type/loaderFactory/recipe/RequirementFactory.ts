import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { Requirement } from 'src/type/loader/recipe/requirement/RequirementLoader';
import { SuperFactory } from '../SuperFactory';

export class RequirementFactory extends SuperFactory {
  loaders = [new Requirement()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.requirement;
  }
}
