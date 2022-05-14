import Dexie from 'dexie';
import { getCurrentVersionAndLanguageAllJsonItems } from './api/jsonItemApi';
import { JsonItem } from './type';

class CddaGameData extends Dexie {
  jsonItems!: Dexie.Table<JsonItem, string>;
  savedVersions!: Dexie.Table<SavedVersion, string>;

  constructor() {
    super('CddaGameData');
    this.version(1).stores({
      jsonItems: '_id, [type+language+startVersion.branch+mod+jsonId]',
      savedVersions: '++_id, [versionId+language]',
    });
  }
}

export interface SavedVersion {
  _id: string;
  versionId: string;
  language: string;
}
export const db = new CddaGameData();
db.open().catch((e) => console.error('open fail', e));

export async function updataCddaGameData(newVersion: string, newLanguage: string) {
  console.group('Update IndexedDB Data');
  const newSevedVersion = { versionId: newVersion, language: newLanguage };
  const dbSavedVersion = await db.savedVersions.get(newSevedVersion);
  if (dbSavedVersion) {
    console.debug('No need Update version: %s, language: %s', newVersion, newLanguage);
  } else {
    console.debug('Start Update version: %s, language: %s', newVersion, newLanguage);
    const newJsonItems = await getCurrentVersionAndLanguageAllJsonItems(newLanguage, newVersion);
    await db.jsonItems.bulkPut(newJsonItems);
    await db.savedVersions.add(newSevedVersion as SavedVersion);
    console.debug('End Update version: %s, language: %s', newVersion, newLanguage);
  }
  console.groupEnd();
}
