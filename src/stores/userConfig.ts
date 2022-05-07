import { defineStore } from 'pinia';
import { LANGUAGE_OPTIONS } from 'src/constant';
import { KEY_USER_CONFIG } from 'src/constant/storageConstant';
import { SelectOption } from 'src/type';

export const useUserConfigStore = defineStore('userConfig', {
  state: initUserConfigState,
  getters: {},
  actions: {
    selectLanguage(newLanguage: SelectOption) {
      this.language = newLanguage;
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
    return {
      language: LANGUAGE_OPTIONS[0],
    };
  }
}

interface UserConfigInterface {
  language: SelectOption;
}
