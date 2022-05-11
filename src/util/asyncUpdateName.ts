import { AsyncId } from 'src/type/common/AsyncId';
import { arrayIsEmpty } from './commonUtil';
import { getTranslationString } from './jsonUtil';

export async function commonUpdateName(asyncId: AsyncId) {
  const cddaItems = await asyncId.getCddaItems();
  if (arrayIsEmpty(cddaItems)) return;
  const json = cddaItems[0].jsonItem.content;
  if ('name' in json) {
    asyncId.value.name = getTranslationString(json as Record<string, unknown>, 'name');
  }
}

export async function updateNameAndDes(asyncId: AsyncId) {
  const cddaItems = await asyncId.getCddaItems();
  if (arrayIsEmpty(cddaItems)) return;
  const json = cddaItems[0].jsonItem.content;
  if ('name' in json && 'description' in json) {
    const name = getTranslationString(json as Record<string, unknown>, 'name');
    const description = getTranslationString(json as Record<string, unknown>, 'description');
    asyncId.value.name = name + ': ' + description;
  }
}
