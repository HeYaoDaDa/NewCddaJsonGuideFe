import { cddaData } from 'src/CddaData';
import { findLoader } from 'src/util/cddaItemUtil';
import { SuperLoader } from '../loader/baseLoader/SuperLoader';
import { JsonItem } from './baseType';

export class CddaItem {
  jsonItem: JsonItem;
  data?: SuperLoader<object>;

  constructor(jsonItem?: JsonItem) {
    this.jsonItem = jsonItem ?? ({} as JsonItem);
  }

  async getData(loader?: SuperLoader<object>) {
    const myLoader = this.data ?? loader ?? findLoader(this);
    if (!myLoader.isLoad) {
      await myLoader.load(this.jsonItem);
    }
    if (!this.data) {
      cddaData.addLoaderByJsonItem(this.jsonItem, myLoader);
      this.data = myLoader;
    }
    return myLoader;
  }
}
