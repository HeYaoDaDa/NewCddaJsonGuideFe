import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getArray } from './baseJsonUtil';
import { arrayIsEmpty } from './commonUtil';
import { getTranslationString } from './jsonUtil';

export function commonUpdateName(asyncId: CddaItemRef) {
  const cddaItems = asyncId.getCddaItems();
  if (arrayIsEmpty(cddaItems)) return;
  const json = cddaItems[0].jsonItem.content;
  if ('name' in json) {
    asyncId.value.name = getTranslationString(json as Record<string, unknown>, 'name');
  }
}

export function updateNameAndDes(asyncId: CddaItemRef) {
  const cddaItems = asyncId.getCddaItems();
  if (arrayIsEmpty(cddaItems)) return;
  const json = cddaItems[0].jsonItem.content;
  if ('name' in json && 'description' in json) {
    const name = getTranslationString(json as Record<string, unknown>, 'name');
    const description = getTranslationString(json as Record<string, unknown>, 'description');
    asyncId.value.name = name + ': ' + description;
  }
}

export function updateNameInField(asyncId: CddaItemRef) {
  const cddaItems = asyncId.getCddaItems();
  if (arrayIsEmpty(cddaItems)) return;
  const json = cddaItems[0].jsonItem.content;
  if ('intensity_levels' in json) {
    const intensitys = getArray(json as Record<string, unknown>, 'intensity_levels') as { name: string }[];
    let name = '';
    intensitys.forEach((v, i, a) => {
      name += v.name;
      if (i < a.length - 1) {
        name += '/';
      }
    });
    asyncId.value.name = name;
  }
}
