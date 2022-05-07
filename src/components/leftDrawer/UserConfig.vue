<template>
  <q-list>
    <q-item-label header> User Config </q-item-label>

    <language-select />

    <version-select />
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
</script>
