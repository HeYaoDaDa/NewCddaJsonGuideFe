import { getJsonItemListByJsonId } from 'src/api';
import { itemTypes } from 'src/constant/dataConstant';
import { loaderFactorys } from 'src/constant/factoryConstant';
import { useCddaData } from 'src/stores/cddaData';
import { CddaItem } from 'src/type/common/CddaItem';
import { Dummy } from 'src/type/loader/baseLoader/DummyLoader';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { arrayIsEmpty, arrayIsNotEmpty, stringIsEmpty } from './commonUtil';

export async function getCddaItemByTypeAndId(jsonType: string, jsonId: string): Promise<CddaItem[]> {
  if (stringIsEmpty(jsonType) || stringIsEmpty(jsonId)) {
    return [];
  }
  const cacheCddaItems = getCddaItemsByTypesAndId(convertType(jsonType), jsonId);
  if (arrayIsNotEmpty(cacheCddaItems)) {
    return cacheCddaItems;
  } else {
    return fetchCddaItemsByTypeAndId(jsonType, jsonId);
  }
}

function getCddaItemsByTypesAndId(jsonTypes: string[], jsonId: string): CddaItem[] {
  const result = new Array<CddaItem>();
  jsonTypes.forEach((jsonType) => result.push(...getCddaItemsByTypeAndId(jsonType, jsonId)));
  return result;
}

function getCddaItemsByTypeAndId(jsonType: string, jsonId: string): CddaItem[] {
  const cddaData = useCddaData();
  if (cddaData.data.get(jsonType)?.has(jsonId)) {
    return cddaData.data.get(jsonType)?.get(jsonId) ?? [];
  }
  return [];
}

async function fetchCddaItemsByTypeAndId(jsonType: string, jsonId: string): Promise<CddaItem[]> {
  const cddaData = useCddaData();
  const jsonItems = await getJsonItemListByJsonId(jsonType, jsonId);
  if (arrayIsEmpty(jsonItems)) {
    console.debug(`getJsonItemListByJsonId result is empty, Type is ${jsonType}, Id is ${jsonId}`);
    return [];
  }
  const cddaItems = jsonItems.map((jsonItem) => {
    return new CddaItem(jsonItem);
  });
  cddaData.addCddaItem(cddaItems);
  return cddaItems;
}

export function findLoader(cddaItem: CddaItem): SuperLoader<object> {
  return loaderFactorys.find((loaderFactory) => loaderFactory.validate(cddaItem))?.getLoader() ?? new Dummy();
}

function convertType(type: string): string[] {
  if (type === 'item') {
    return itemTypes;
  } else {
    return [type];
  }
}
