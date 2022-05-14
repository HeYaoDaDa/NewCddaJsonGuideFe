<template>
  <q-list>
    <q-item-label header> User Config </q-item-label>

    <language-select />

    <version-select />

    <mods-select />
  </q-list>
</template>

<script lang="ts">
export default {
  name: 'UserConfig',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import LanguageSelect from 'src/components/leftDrawer/LanguageSelect.vue';
import VersionSelect from 'src/components/leftDrawer/VersionSelect.vue';
import { LOG_NO_CHANGE_COMPUTED } from 'src/constant/loggerConstant';
import { updataCddaGameData } from 'src/db';
import { useCddaData } from 'src/stores/cddaData';
import { useUserConfigStore } from 'src/stores/userConfig';
import { computed, watch } from 'vue';
import ModsSelect from './ModsSelect.vue';
const userConfig = useUserConfigStore();
const cddaData = useCddaData();
watch(
  computed({
    get: () => [userConfig.language.value, userConfig.version._id, userConfig.mods.map((mod) => mod.data.id)],
    set: () => console.error(LOG_NO_CHANGE_COMPUTED),
  }),
  () => {
    cddaData.clear();
  }
);
watch(
  computed({
    get: () => [userConfig.language.value, userConfig.version._id],
    set: () => console.error(LOG_NO_CHANGE_COMPUTED),
  }),
  async (newValue) => {
    updataCddaGameData(newValue[1], newValue[0]);
  }
);
</script>
