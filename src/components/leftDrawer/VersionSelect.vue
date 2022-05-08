<template>
  <q-select
    filled
    v-model="selectedGameVersion"
    :options="options"
    option-label="tagName"
    :label="$t('label.gameVersion')"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
import { computed, reactive } from 'vue';
import { useUserConfigStore } from 'src/stores/userConfig';
import { getVersions } from 'src/api';
import { Version } from 'src/type';
export default {
  name: 'VersionSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const options = reactive([] as Version[]);
const userConfig = useUserConfigStore();

const selectedGameVersion = computed({
  get: () => userConfig.version,
  set: (val) => {
    userConfig.selectVersion(val);
  },
});

void getVersions().then((newVersions) => {
  options.length = 0;
  options.push(...newVersions);
});
</script>
