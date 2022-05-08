<template>
  <q-select filled v-model="selectedLanguage" :options="LANGUAGE_OPTIONS" options-dense>
    <template v-slot:prepend> <q-icon name="language" /> </template>
  </q-select>
</template>

<script lang="ts">
export default {
  name: 'LanguageSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { watch, computed } from 'vue';
import { Quasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserConfigStore } from 'src/stores/userConfig';
import { LANGUAGE_OPTIONS } from 'src/constant/index';

const { locale } = useI18n({ useScope: 'global' });
const userConfig = useUserConfigStore();

locale.value = userConfig.language.value;
void import('quasar/lang/' + userConfig.language.value).then((lang: typeof import('quasar/lang/*')) => {
  Quasar.lang.set(lang.default);
});

const selectedLanguage = computed({
  get: () => userConfig.language,
  set: (val) => {
    userConfig.selectLanguage(val);
  },
});

watch(selectedLanguage, (newLanguage) => {
  const newLocale = newLanguage.value;
  locale.value = newLocale;
  void import('quasar/lang/' + newLocale).then((lang: typeof import('quasar/lang/*')) => {
    Quasar.lang.set(lang.default);
  });
});
</script>
