<template>
  <my-field label="energy">
    <my-text :content="data.energy" />
  </my-field>

  <my-field label="perperualFuel">
    <my-text :content="data.isPerpetualFuel" />
  </my-field>

  <my-field label="explosion" v-if="props.cddaData.data.explosionData">
    <fuel-explosion-field-set :cddaData="props.cddaData.data.explosionData" />
  </my-field>

  <my-field label="pumpTerrain" v-if="data.pumpTerrain">
    <my-text-async-id :content="toArray(data.pumpTerrain)" />
  </my-field>
</template>

<script lang="ts">
export default {
  name: 'FuelFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import FuelExplosionFieldSet from 'src/components/loaderView/card/material/FuelExplosionFieldSet.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { Fuel } from 'src/type/loader/baseLoader/material/FuelLoader';
import { reactive } from 'vue';
import { toArray } from 'src/util/commonUtil';
const props = defineProps<{
  cddaData: Fuel;
}>();
const data = reactive(props.cddaData.data);
</script>
