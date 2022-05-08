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
    updateVersionInfo(newVersions: Version[]) {
      if (arrayIsNotEmpty(newVersions)) {
        if (this.version._id === KEY_LATEST_VERSION_ID) {
          this.version._id = newVersions[0]._id;
        }
        const updateVersion = newVersions.find(
          (v) => this.version._id === v._id
        );
        if (updateVersion) {
          this.version.branch = updateVersion.branch;
          this.version.createDate = updateVersion.createDate;
          this.version.publishDate = updateVersion.publishDate;
          this.version.releaseDescribe = updateVersion.releaseDescribe;
          this.version.releaseId = updateVersion.releaseId;
          this.version.tagDate = updateVersion.tagDate;
          this.version.tagMessage = updateVersion.tagMessage;
          this.version.tagName = updateVersion.tagName;
          this.version.targetCommit = updateVersion.targetCommit;
        }
      }
    },
    updateModsInfo(newMods: Mod[]) {
      if (arrayIsNotEmpty(newMods)) {
        this.mods.forEach((mod, i, a) => {
          const updateMod = newMods.find((v) => mod.data.id === v.data.id);
          if (updateMod) {
            a[i] = updateMod;
          }
        });
      }
    },
  },
});

useUserConfigStore().$subscribe((mutation, state) => {
  console.debug('User Config Change!');
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
