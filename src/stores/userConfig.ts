import { defineStore } from 'pinia';
import { LANGUAGE_OPTIONS } from 'src/constant';
import { KEY_LATEST_VERSION_ID } from 'src/constant/dataConstant';
import { KEY_USER_CONFIG } from 'src/constant/storageConstant';
import { JsonItem, SelectOption, Version } from 'src/type';
import { Mod } from 'src/type/loader/baseLoader/ModLoader';
import { arrayIsNotEmpty } from 'src/util/commonUtil';

export const useUserConfigStore = defineStore(KEY_USER_CONFIG, {
  state: initUserConfigState,
  getters: {},
  actions: {
    selectLanguage(newLanguage: SelectOption) {
      this.language = newLanguage;
    },
    selectVersion(newVersion: Version) {
      this.version = newVersion;
    },
    selectMods(newMods: Mod[]) {
      this.mods = newMods;
    },
    async updataAllMods(allModJsonItems: JsonItem[]) {
      this.allMods.splice(
        0,
        this.allMods.length,
        ...(await Promise.all(
          allModJsonItems.map(async (jsonItem) => {
            const mod = new Mod();
            await mod.load(jsonItem);
            return mod;
          })
        ))
      );
      this.updateModsInfo(this.allMods);
    },
    /**
     * if User's Version and Language change need update
     * @param newMods latest Mod List
     */
    updateModsInfo(newMods: Mod[]) {
      if (arrayIsNotEmpty(newMods)) {
        this.mods.forEach((mod) => {
          const updateMod = newMods.find((v) => mod.data.id === v.data.id);
          if (updateMod) {
            mod.data.name = updateMod.data.name;
          }
        });
      }
    },
    updateVersion(newVersion: Version[]) {
      if (this.version._id === KEY_LATEST_VERSION_ID) {
        console.debug('updateVersion: Start update latest version id');
        this.version = newVersion.reduce((latest, current) =>
          latest.publishDate > current.publishDate ? latest : current
        );
      }
    },
  },
});

/**
 * if userConfig update, we need save to localStorage
 */
useUserConfigStore().$subscribe((mutation, state) => {
  console.debug('Save new user config %o', state);
  localStorage.setItem(KEY_USER_CONFIG, JSON.stringify(state));
});

/**
 * init User Config, if have localStortage, from localStrotage.else return default value
 * @returns current User Config
 */
function initUserConfigState(): UserConfigInterface {
  const userConfig = localStorage.getItem(KEY_USER_CONFIG);
  if (userConfig) {
    return JSON.parse(userConfig);
  } else {
    const defaultMod = new Mod();
    defaultMod.data.id = 'dda';
    defaultMod.data.name = 'dda';
    return {
      language: LANGUAGE_OPTIONS[0],
      version: {
        _id: KEY_LATEST_VERSION_ID,
        releaseId: '',
        releaseDescribe: '',
        targetCommit: '',
        branch: 0,
        createDate: new Date(),
        publishDate: new Date(),
        tagName: '',
        tagMessage: '',
        tagDate: new Date(),
      },
      mods: [defaultMod],
      allMods: [defaultMod],
    };
  }
}

interface UserConfigInterface {
  language: SelectOption;
  version: Version;
  mods: Mod[];
  allMods: Mod[];
}
