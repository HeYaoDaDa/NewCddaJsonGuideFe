<template>
  <q-card v-if="isShow" class="col q-my-sm q-mx-xs" :style="{ 'min-width': '-webkit-fill-available' }">
    <q-card-section>
      <q-expansion-item label="JSON">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="proceed" :label="$t('label.proceed')" />
          <q-tab name="original" :label="$t('label.original')" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="proceed">
            <pre>{{ json }}</pre>
          </q-tab-panel>
          <q-tab-panel name="original">
            <q-spinner v-if="spinnerShow" />
            <pre v-else>{{ originalJson }}</pre>
          </q-tab-panel>
        </q-tab-panels>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { JsonItem } from 'src/type';
import { ref } from 'vue';
export default {
  name: 'JsonCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const tab = ref('proceed');
const json = ref(JSON.stringify(props.jsonItem.content, null, 4));
const originalJson = ref(props.jsonItem.originalContent);
const isShow = json.value != undefined;
const spinnerShow = ref(false);
</script>
