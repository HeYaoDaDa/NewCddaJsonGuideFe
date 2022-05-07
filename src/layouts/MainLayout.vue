<template>
  <q-layout view="hHr LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" show-if-above bordered>
      <user-config />
    </q-drawer>

    <q-drawer side="right" bordered show-if-above>
      <p>test</p>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue';
import UserConfig from 'src/components/leftDrawer/UserConfig.vue';
export default {
  name: 'MainLayout',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
