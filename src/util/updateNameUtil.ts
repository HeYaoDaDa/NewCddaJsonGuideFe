import { CddaItemRef } from 'src/type/common/CddaItemRef';
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
