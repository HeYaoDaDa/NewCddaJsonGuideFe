import { reactive, ref } from 'vue';
import { SavedVersion } from './db';
import { useUserConfigStore } from './stores/userConfig';
import { JsonItem } from './type/common/baseType';
import { CddaItem } from './type/common/CddaItem';
import { SuperLoader } from './type/loader/baseLoader/SuperLoader';
import { arrayIsNotEmpty, arrayPush, toArray } from './util/commonUtil';
import { getAllJsonItems, isExitsVersionInDb, updataCddaGameData } from './util/dbUtil';

class CddaData {
  byTypeAndId = reactive(new Map<string, Map<string, CddaItem[]>>());

  isLoad = ref(false);

  hasLoad() {
    return this.isLoad.value && this.byTypeAndId.size > 0;
  }

  addCddaItem(cddaItems: CddaItem[] | CddaItem) {
    console.debug('Start addCddaItem length: %s', toArray(cddaItems).length);
    toArray(cddaItems).forEach((cddaItem) => {
      const cddaItemType = cddaItem.jsonItem.type;
      let jsonTypeMap = this.byTypeAndId.get(cddaItemType);
      if (jsonTypeMap) {
        jsonTypeMap.set(cddaItem.jsonItem.jsonId, arrayPush(jsonTypeMap.get(cddaItem.jsonItem.jsonId), cddaItem));
      } else {
        jsonTypeMap = new Map<string, CddaItem[]>();
        jsonTypeMap.set(cddaItem.jsonItem.jsonId, arrayPush(jsonTypeMap.get(cddaItem.jsonItem.jsonId), cddaItem));
        this.byTypeAndId.set(cddaItemType, jsonTypeMap);
      }
    });
    console.debug('End addCddaItem type size is %s', this.byTypeAndId.size);
  }

  addJsonItem(jsonItems: JsonItem[] | JsonItem) {
    this.addCddaItem(toArray(jsonItems).map((jsonItem) => new CddaItem(jsonItem)));
  }

  clear() {
    console.debug('clear old cdda data');
    this.isLoad.value = false;
    this.byTypeAndId.clear();
  }

  clearMod(deletedModIds: string[]) {
    if (arrayIsNotEmpty(deletedModIds)) {
      const filterFun = (cddaItems: CddaItem[]) =>
        cddaItems.splice(
          0,
          cddaItems.length,
          ...cddaItems.filter((cddaItem) =>
            deletedModIds.some((deletedModId) => deletedModId === cddaItem.jsonItem.mod)
          )
        );
      this.byTypeAndId.forEach((byType) => byType.forEach(filterFun));
    }
  }

  async updateMods(newModIds: string[], oldModIds: string[]) {
    const deletedModIds = oldModIds.filter((oldModId) => !newModIds.some((newModId) => oldModId === newModId));
    const addedModIds = newModIds.filter((newModId) => !oldModIds.some((oldModId) => oldModId === newModId));
    cddaData.clearMod(deletedModIds);
    if (arrayIsNotEmpty(addedModIds)) {
      cddaData.addJsonItem(await getAllJsonItems(undefined, undefined, addedModIds));
    }
  }

  addLoader(type: string, id: string, _id: string, loader: SuperLoader<object>) {
    const cddaItems = this.byTypeAndId.get(type)?.get(id);
    if (cddaItems) {
      const cddaItem = cddaItems.find((cddaItem) => cddaItem.jsonItem._id === _id);
      if (cddaItem) {
        cddaItem.data = loader;
      }
    }
  }

  addLoaderByJsonItem(jsonItem: JsonItem, loader: SuperLoader<object>) {
    this.addLoader(jsonItem.type, jsonItem.jsonId, jsonItem._id, loader);
  }
}

export const cddaData = new CddaData();

export async function initCddaData() {
  const userConfig = useUserConfigStore();
  console.debug(
    'start initCddaData, language is %s, version is %s, mods is %s',
    userConfig.language.value,
    userConfig.version.tagName,
    userConfig.mods.map((mod) => mod.data.id)
  );
  if (!cddaData.hasLoad()) {
    console.debug('cddaData no load, start load');
    if (
      await isExitsVersionInDb({
        versionId: userConfig.version._id,
        language: userConfig.language.value,
      } as SavedVersion)
    ) {
      console.debug('db have data, from db load CddaData');
      const jsonItems = await getAllJsonItems();
      cddaData.addJsonItem(jsonItems);
    } else {
      await updataCddaGameData(
        userConfig.version._id,
        userConfig.language.value,
        userConfig.mods.map((mod) => mod.data.id)
      );
    }
    cddaData.isLoad.value = true;
  } else {
    console.debug('cddaData is load, no need load, size is %s', cddaData.byTypeAndId.size);
  }
  console.debug('end initCddaData');
}
