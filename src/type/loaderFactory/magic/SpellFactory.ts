import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { Spell } from 'src/type/loader/magic/SpellLoader';
import { SuperFactory } from '../SuperFactory';

export class SpellFactory extends SuperFactory {
  loaders = [new Spell()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.spell;
  }
}
