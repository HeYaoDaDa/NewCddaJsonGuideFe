<template>
  <q-page v-if="show" class="row justify-around content-start">
    <cdda-items-view />
    <p v-if="cddaItems.length === 0">no find</p>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { cddaData } from 'src/CddaData';
import MegerVNode from 'src/components/base/MegerVNode.vue';
import { loadCddaItems, viewCddaItems } from 'src/components/center/ViewCddaItems';
import { LOG_NO_CHANGE_COMPUTED } from 'src/constant/loggerConstant';
import { useUserConfigStore } from 'src/stores/userConfig';
import { CddaItem } from 'src/type/common/CddaItem';
import { getCddaItemByTypeAndId } from 'src/util/cddaItemUtil';
import { computed, h, reactive, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
export default {
  name: 'JsonItemPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const $route = useRoute();
const cddaItems = reactive(new Array<CddaItem>());
const userConfig = useUserConfigStore();
const show = ref(false);
const $q = useQuasar();
let cddaItemsView = h(MegerVNode, null, () => viewCddaItems(cddaItems.map((cddaItem) => cddaItem.data)));

async function updateCddaItem(jsonType: string, jsonId: string) {
  console.debug('updateJsonItem start, CddaData load is %s', cddaData.hasLoad());
  show.value = false;
  let loadingConsole = !$q.loading.isActive;
  if (loadingConsole) $q.loading.show();
  if (cddaData.hasLoad()) {
    const newCddaItems = await getCddaItemByTypeAndId(jsonType, jsonId);
    cddaItems.splice(0, cddaItems.length, ...newCddaItems);
    await loadCddaItems(cddaItems);
  }
  show.value = true;
  if (loadingConsole) $q.loading.hide();
}

updateCddaItem($route.params.jsonType as string, $route.params.jsonId as string).catch((e) => console.error(e));

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    console.debug('JsonItemPage route update');
    void updateCddaItem(to.params.jsonType as string, to.params.jsonId as string);
  }
});

watch(
  computed({
    get: () => [
      userConfig.language.value,
      userConfig.version._id,
      userConfig.mods.map((mod) => mod.data.id),
      cddaData.isLoad.value,
    ],
    set: () => console.error(LOG_NO_CHANGE_COMPUTED),
  }),
  (newValue, oldValue) => {
    console.debug('JsonItemPage Watch Trigger new is %o, old is %o', newValue, oldValue);
    void updateCddaItem($route.params.jsonType as string, $route.params.jsonId as string);
  }
);
</script>
