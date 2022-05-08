import { JsonItem } from './baseType';
import { SuperLoader } from '../loader/baseLoader/SuperLoader';

export interface CddaItem {
  jsonItem: JsonItem;
  data?: SuperLoader<object>;
}
