<template>
  <my-field label="chanceHot">
    <my-text :content="data.chanceHot" />
  </my-field>

  <my-field label="chanceCold">
    <my-text :content="data.chanceCold" />
  </my-field>

  <my-field label="factor">
    <my-text :content="data.factor" />
  </my-field>

  <my-field label="sizeFactor">
    <my-text :content="data.sizeFactor" />
  </my-field>

  <my-field label="fiery">
    <my-text :content="data.fiery" />
  </my-field>
</template>

<script lang="ts">
export default {
  name: 'FuelExplosionFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { FuelExplosion } from 'src/type/loader/baseLoader/material/FuelExplosionLoader';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: FuelExplosion;
}>();
const data = reactive(props.cddaData.data);
</script>
