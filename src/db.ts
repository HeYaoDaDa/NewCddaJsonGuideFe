import Dexie from 'dexie';
import { JsonItem } from './type';

class CddaGameData extends Dexie {
  jsonItems!: Dexie.Table<JsonItem, string>;
  savedVersions!: Dexie.Table<SavedVersion, string>;

  constructor() {
    super('CddaGameData');
    this.version(1).stores({
      jsonItems: '_id, [language+startVersion.branch+mod], [language+startVersion.branch+type]',
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
