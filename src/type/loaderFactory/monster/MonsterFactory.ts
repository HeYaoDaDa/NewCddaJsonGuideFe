import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { Monster } from 'src/type/loader/monster/MonsterLoader';
import { SuperFactory } from '../SuperFactory';

export class MonsterFactory extends SuperFactory {
  loaders = [new Monster()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.monster;
  }
}
