<template>
  <q-select
    filled
    v-model="selectedGameVersion"
    :options="props.allVersions"
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
import { useUserConfigStore } from 'src/stores/userConfig';
import { Version } from 'src/type';
import { computed } from 'vue';
export default {
  name: 'VersionSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  allVersions: Version[];
}>();

const userConfig = useUserConfigStore();

const selectedGameVersion = computed({
  get: () => userConfig.version,
  set: (val) => {
    userConfig.selectVersion(val);
  },
});
</script>
