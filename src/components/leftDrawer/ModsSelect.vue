<template>
  <q-select
    filled
    v-model="selectedMods"
    :options="userConfig.allMods"
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
import { useUserConfigStore } from 'src/stores/userConfig';
import { computed } from 'vue';

const userConfig = useUserConfigStore();

const selectedMods = computed({
  get: () => userConfig.mods,
  set: (val) => {
    userConfig.selectMods(val);
  },
});
</script>
