<template>
  <q-select
    filled
    v-model="selectedMods"
    :options="options"
    :option-label="(option) => option.data.name"
    :label="$t('label.mods')"
    multiple
    use-chips
    behavior="dialog"
  />
</template>

<script lang="ts">
export default {
  name: 'ModsSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useUserConfigStore } from 'src/stores/userConfig';
import { getModsOptions } from 'src/api';
import { Mod } from 'src/type/loader/baseLoader/ModLoader';
import { LOG_NO_CHANGE_COMPUTED } from 'src/constant/loggerConstant';

const userConfig = useUserConfigStore();
const options = reactive([] as Array<Mod>);

const selectedMods = computed({
  get: () => userConfig.mods,
  set: (val) => {
    userConfig.selectMods(val);
  },
});
function initModsSelect() {
  getModsOptions().then((newOptions) => {
    options.length = 0;
    options.push(...newOptions);
    userConfig.updateModsInfo(newOptions);
  });
}

initModsSelect();
watch(
  computed({
    get: () => [userConfig.language, userConfig.version],
    set: () => console.error(LOG_NO_CHANGE_COMPUTED),
  }),
  () => initModsSelect()
);
</script>
