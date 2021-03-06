import { cddaData } from 'src/CddaData';
import { itemTypes } from 'src/constant/dataConstant';
import { loaderFactorys } from 'src/constant/factoryConstant';
import { CddaItem } from 'src/type/common/CddaItem';
import { Dummy } from 'src/type/loader/baseLoader/DummyLoader';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { stringIsEmpty } from './commonUtil';

export function getCddaItemByTypeAndId(jsonType: string, jsonId: string): CddaItem[] {
  if (stringIsEmpty(jsonType) || stringIsEmpty(jsonId)) {
    return [];
  }
  const cacheCddaItems = getCddaItemsByTypesAndId(convertType(jsonType), jsonId);
  return cacheCddaItems;
}

function getCddaItemsByTypesAndId(jsonTypes: string[], jsonId: string): CddaItem[] {
  const result = new Array<CddaItem>();
  jsonTypes.forEach((jsonType) => result.push(...getCddaItemsByTypeAndId(jsonType, jsonId)));
  return result;
}

function getCddaItemsByTypeAndId(jsonType: string, jsonId: string): CddaItem[] {
  console.debug('getCddaItemsByTypeAndId', jsonType, jsonId, cddaData.byTypeAndId.get(jsonType));
  if (cddaData.byTypeAndId.get(jsonType)?.has(jsonId)) {
    return cddaData.byTypeAndId.get(jsonType)?.get(jsonId) ?? [];
  }
  return [];
}

export function getCddaItemsByType(jsonType: string): CddaItem[] {
  const typeMap = cddaData.byTypeAndId.get(jsonType);
  const result: CddaItem[] = [];
  if (typeMap) {
    typeMap.forEach((cddaItems) => result.push(...cddaItems));
  }
  return result;
}

export function findLoader(cddaItem: CddaItem): SuperLoader<object> {
  return loaderFactorys.find((loaderFactory) => loaderFactory.validate(cddaItem))?.getLoader() ?? new Dummy();
}

export function convertType(type: string): string[] {
  if (type === 'item') {
    return itemTypes;
  } else {
    return [type];
  }
}
