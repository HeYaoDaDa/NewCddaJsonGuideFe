<template>
  <q-list>
    <q-item-label header> User Config </q-item-label>

    <language-select />

    <version-select :allVersions="allVersions" />

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
import { useQuasar } from 'quasar';
import { cddaData, initCddaData } from 'src/CddaData';
import LanguageSelect from 'src/components/leftDrawer/LanguageSelect.vue';
import VersionSelect from 'src/components/leftDrawer/VersionSelect.vue';
import { KEY_LATEST_VERSION_ID } from 'src/constant/dataConstant';
import { LOG_NO_CHANGE_COMPUTED } from 'src/constant/loggerConstant';
import { useUserConfigStore } from 'src/stores/userConfig';
import { Version } from 'src/type/common/baseType';
import { getAllModJsonItems, updataCddaGameData } from 'src/util/dbUtil';
import { updateVersions } from 'src/util/versionUtil';
import { computed, reactive, watch } from 'vue';
import ModsSelect from './ModsSelect.vue';

const userConfig = useUserConfigStore();
const allVersions = reactive([]) as Version[];
const $q = useQuasar();

$q.loading.show();
updateVersions(allVersions)
  .then(() => initCddaData())
  .then(async () => {
    userConfig.updataAllMods(await getAllModJsonItems());
  })
  .then(() => $q.loading.hide());

watch(
  computed({
    get: () => [userConfig.language.value, userConfig.version._id, userConfig.mods.map((mod) => mod.data.id)],
    set: () => console.error(LOG_NO_CHANGE_COMPUTED),
  }),
  async (newValue, oldValue) => {
    $q.loading.show();
    const newLanguage = newValue[0] as string;
    const newVersionId = newValue[1] as string;
    const newModIds = newValue[2] as string[];
    const oldLanguage = oldValue[0] as string;
    const oldVersionId = oldValue[1] as string;
    const oldModIds = oldValue[2] as string[];
    if (oldVersionId === KEY_LATEST_VERSION_ID) {
      //only change default versionId
      console.debug('auto update latest versionId');
    } else if (newLanguage !== oldLanguage || newVersionId !== oldVersionId) {
      //has change language or version, need update db
      await updataCddaGameData(newVersionId, newLanguage, newModIds);
      //need update mods
      await userConfig.updataAllMods(await getAllModJsonItems());
    } else {
      // only change mods, only need update
      cddaData.updateMods(newModIds, oldModIds as string[]);
    }
    $q.loading.hide();
  }
);
</script>
