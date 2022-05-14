import { getCurrentVersionAndLanguageAllJsonItems } from 'src/api/jsonItemApi';
import { cddaData } from 'src/CddaData';
import { CddaType } from 'src/constant/cddaType';
import { db, SavedVersion } from 'src/db';
import { useUserConfigStore } from 'src/stores/userConfig';
import { JsonItem, Version } from 'src/type/common/baseType';

/**
 * from indexed db get all jsonItem, use in init CddaData
 * @param language current language
 * @param version current version
 * @param mods current mods's id
 * @returns language/version/mods's jsonItems
 */
export async function getAllJsonItems(language?: string, version?: Version, mods?: string[]): Promise<JsonItem[]> {
  const userConfig = useUserConfigStore();
  const myLanguage = language ?? userConfig.language.value;
  const myVersion = version ?? userConfig.version;
  const myMods = mods ?? userConfig.mods.map((mod) => mod.data.id);

  const query = new Array<Array<string>>();
  myMods.forEach((modId) => query.push([myLanguage, <string>(<unknown>myVersion.branch), modId]));
  const response = await db.jsonItems
    .where('[language+startVersion.branch+mod]')
    .anyOf(query)
    .and(
      (jsonItem) =>
        jsonItem.startVersion.publishDate <= myVersion.publishDate &&
        jsonItem.endVersion.publishDate >= myVersion.publishDate
    )
    .toArray();
  return response;
}
/**
 * from indexed db get all mods's jsonItem
 * @param language current language
 * @param version current version
 * @returns all mods's jsonItem
 */
export async function getAllModJsonItems(language?: string, version?: Version): Promise<JsonItem[]> {
  const userConfig = useUserConfigStore();
  const myLanguage = language ?? userConfig.language.value;
  const myVersion = version ?? userConfig.version;

  const response = await db.jsonItems
    .where({ language: myLanguage, 'startVersion.branch': <string>(<unknown>myVersion.branch), type: CddaType.modInfo })
    .and(
      (jsonItem) =>
        jsonItem.startVersion.publishDate <= myVersion.publishDate &&
        jsonItem.endVersion.publishDate >= myVersion.publishDate
    )
    .toArray();
  return response;
}

/**
 * updata new version to indexed Db
 * @param newVersion new Version id
 * @param newLanguage new Language Code
 * @returns new version's(incule mods) jsonItems
 */
export async function updataCddaGameData(newVersion: string, newLanguage: string, newModIds: string[]): Promise<void> {
  console.debug('Update CddaGameData Data');
  const newSevedVersion = { versionId: newVersion, language: newLanguage } as SavedVersion;
  let newVersionAllJsonItem: JsonItem[];
  if (await isExitsVersionInDb(newSevedVersion)) {
    console.debug('No need Update version: %s, language: %s', newVersion, newLanguage);
    newVersionAllJsonItem = await getAllJsonItems(newLanguage, undefined, newModIds);
  } else {
    console.debug('Start Update version: %s, language: %s', newVersion, newLanguage);
    const newJsonItems = await getCurrentVersionAndLanguageAllJsonItems(newLanguage, newVersion);
    await db.jsonItems.bulkPut(newJsonItems);
    await db.savedVersions.add(newSevedVersion);
    console.debug('End Update version: %s, language: %s', newVersion, newLanguage);
    newVersionAllJsonItem = newJsonItems.filter((newVersionJsonItem) =>
      newModIds.some((modId) => modId === newVersionJsonItem.mod)
    );
  }
  // need update CddaDate
  cddaData.clear();
  cddaData.addJsonItem(newVersionAllJsonItem);
}

export async function isExitsVersionInDb(newSavedVersion: SavedVersion): Promise<boolean> {
  const dbSavedVersion = await db.savedVersions.get(newSavedVersion);
  return dbSavedVersion !== undefined;
}
