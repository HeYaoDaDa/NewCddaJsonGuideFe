import { defineStore } from 'pinia';
import { LANGUAGE_OPTIONS } from 'src/constant';
import { KEY_LATEST_VERSION_ID } from 'src/constant/dataConstant';
import { KEY_USER_CONFIG } from 'src/constant/storageConstant';
import { SelectOption, Version } from 'src/type';
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
  },
});

useUserConfigStore().$subscribe((mutation, state) => {
  console.debug('Save new user config %o', state);
  localStorage.setItem(KEY_USER_CONFIG, JSON.stringify(state));
});

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
    };
  }
}

interface UserConfigInterface {
  language: SelectOption;
  version: Version;
  mods: Mod[];
}
