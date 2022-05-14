import { db } from 'src/db';
import { useUserConfigStore } from 'src/stores/userConfig';
import { JsonItem } from 'src/type/common/baseType';
import { convertType } from './cddaItemUtil';

export async function getJsonItemListByTypeAndJsonId(
  itemType: string,
  jsonId: string,
  language?: string,
  version?: string,
  mods?: string[]
): Promise<JsonItem[]> {
  const userConfig = useUserConfigStore();
  language = language ?? userConfig.language.value;
  const versionObj = userConfig.version;
  mods = mods ?? userConfig.mods.map((mod) => mod.data.id);
  const jsonTypes = convertType(itemType);
  const query = new Array<Array<string>>();
  mods.forEach((modId) =>
    jsonTypes.forEach((type) =>
      query.push([type, <string>language, <string>(<unknown>versionObj.branch), modId, jsonId])
    )
  );
  const response = await db.jsonItems
    .where('[type+language+startVersion.branch+mod+jsonId]')
    .anyOf(query)
    .and(
      (jsonItem) =>
        jsonItem.startVersion.publishDate <= versionObj.publishDate &&
        jsonItem.endVersion.publishDate >= versionObj.publishDate
    )
    .toArray();
  return response;
}
