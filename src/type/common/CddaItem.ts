import { JsonItem } from './baseType';
import { SuperLoader } from './SuperLoader';

export interface CddaItem {
  jsonItem: JsonItem;
  data?: SuperLoader<object>;
}
