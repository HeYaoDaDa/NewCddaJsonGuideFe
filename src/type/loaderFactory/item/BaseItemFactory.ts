import { CddaItem } from 'src/type/common/CddaItem';
import { BaseItem } from 'src/type/loader/item/BaseItemLoader';
import { isItem } from 'src/util/dataUtil';
import { SuperFactory } from '../SuperFactory';

export class BaseItemFactory extends SuperFactory {
  loaders = [new BaseItem()];

  validate(cdddaItem: CddaItem): boolean {
    return isItem(cdddaItem.jsonItem.type);
  }
}
