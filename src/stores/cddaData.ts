import { defineStore } from 'pinia';
import { KEY_CDDA_DATA } from 'src/constant/storageConstant';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItem } from 'src/type/common/CddaItem';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { arrayPush, toArray } from 'src/util/commonUtil';

export const useCddaData = defineStore(KEY_CDDA_DATA, {
  state: () => {
    return { data: new Map<string, Map<string, CddaItem[]>>() };
  },
  getters: {},
  actions: {
    addCddaItem(cddaItems: CddaItem[] | CddaItem) {
      toArray(cddaItems).forEach((cddaItem) => {
        let jsonTypeMap = this.data.get(cddaItem.jsonItem.type);
        if (jsonTypeMap) {
          jsonTypeMap.set(cddaItem.jsonItem.jsonId, arrayPush(jsonTypeMap.get(cddaItem.jsonItem.jsonId), cddaItem));
        } else {
          jsonTypeMap = new Map<string, CddaItem[]>();
          jsonTypeMap.set(cddaItem.jsonItem.jsonId, arrayPush(jsonTypeMap.get(cddaItem.jsonItem.jsonId), cddaItem));
          this.data.set(cddaItem.jsonItem.type, jsonTypeMap);
        }
      });
    },
    addJsonItem(jsonItems: JsonItem[] | JsonItem) {
      this.addCddaItem(toArray(jsonItems).map((jsonItem) => new CddaItem(jsonItem)));
    },
    clear() {
      console.debug('clear old cdda data');
      this.data.clear();
    },
    addLoader(type: string, id: string, _id: string, loader: SuperLoader<object>) {
      const cddaItems = this.data.get(type)?.get(id);
      if (cddaItems) {
        const cddaItem = cddaItems.find((cddaItem) => cddaItem.jsonItem._id === _id);
        if (cddaItem) {
          cddaItem.data = loader;
        }
      }
    },
    addLoaderByJsonItem(jsonItem: JsonItem, loader: SuperLoader<object>) {
      this.addLoader(jsonItem.type, jsonItem.jsonId, jsonItem._id, loader);
    },
  },
});
