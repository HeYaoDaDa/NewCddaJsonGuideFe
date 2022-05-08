import { getJsonItemListByJsonId } from 'src/api';
import { useCddaData } from 'src/stores/cddaData';
import { CddaItem } from 'src/type/common/CddaItem';
import { arrayIsEmpty, stringIsEmpty } from './commonUtil';

export async function getCddaItemByTypeAndId(
  jsonType: string,
  jsonId: string
): Promise<CddaItem[]> {
  if (stringIsEmpty(jsonType) || stringIsEmpty(jsonId)) {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
  const cddaData = useCddaData();
  if (cddaData.data.get(jsonType)?.has(jsonId)) {
    return new Promise((resolve) => {
      resolve(cddaData.data.get(jsonType)?.get(jsonId) ?? []);
    });
  } else {
    const jsonItems = await getJsonItemListByJsonId(jsonType, jsonId);
    if (arrayIsEmpty(jsonItems)) {
      console.debug(
        `getJsonItemListByJsonId result is empty, Type is ${jsonType}, Id is ${jsonId}`
      );
      return [];
    }
    cddaData.addJsonItem(jsonItems);
    return jsonItems.map((jsonItem) => {
      return { jsonItem };
    });
  }
}
