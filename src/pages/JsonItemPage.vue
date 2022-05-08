<template>
  <q-page v-if="show" class="row justify-around content-start">
    <template v-for="cddaItem in cddaItems" :key="cddaItem.jsonItem._id">
      <factory-select1 :cddaItem="cddaItem" />
    </template>
    <p v-if="cddaItems.length === 0">no find</p>
  </q-page>
</template>

<script lang="ts">
import { Loading } from 'quasar';
import FactorySelect1 from 'src/components/center/FactorySelect.vue';
import { LOG_NO_CHANGE_COMPUTED } from 'src/constant/loggerConstant';
import { useUserConfigStore } from 'src/stores/userConfig';
import { CddaItem } from 'src/type/common/CddaItem';
import { getCddaItemByTypeAndId } from 'src/util/cddaItemUtil';
import { computed, reactive, ref, watch } from 'vue';
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

async function updateCddaItem(jsonType: string, jsonId: string) {
  console.debug('updateJsonItem start');
  show.value = false;
  Loading.show();
  const newCddaItems = await getCddaItemByTypeAndId(jsonType, jsonId);
  cddaItems.length = 0;
  cddaItems.push(...newCddaItems);
  show.value = true;
  Loading.hide();
}

updateCddaItem(
  $route.params.jsonType as string,
  $route.params.jsonId as string
);

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    console.debug('JsonItemPage route update');
    updateCddaItem(to.params.jsonType as string, to.params.jsonId as string);
  }
});

watch(
  computed({
    get: () => [
      userConfig.language.value,
      userConfig.version._id,
      userConfig.mods.map((mod) => mod.data.id),
    ],
    set: () => console.error(LOG_NO_CHANGE_COMPUTED),
  }),
  () => {
    updateCddaItem(
      $route.params.jsonType as string,
      $route.params.jsonId as string
    );
  }
);
</script>
