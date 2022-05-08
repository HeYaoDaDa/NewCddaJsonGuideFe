import { AsyncId } from 'src/type/common/AsyncId';
import { getOptionalUnknown } from './baseJsonUtil';
import { arrayIsEmpty } from './commonUtil';
import { getGetTextTransationString } from './getTextUtil';

export async function commonUpdateName(asyncId: AsyncId) {
  const cddaItems = await asyncId.getCddaItems();
  if (arrayIsEmpty(cddaItems)) return;
  const json = cddaItems[0].jsonItem.content;
  if ('name' in json) {
    const nameObject = getOptionalUnknown(json as Record<string, unknown>, 'name');
    asyncId.value.name = getGetTextTransationString(nameObject);
  }
}
