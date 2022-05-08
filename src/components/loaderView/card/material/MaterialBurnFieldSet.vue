<template>
  <my-field label="immune">
    <my-text :content="data.immune" />
  </my-field>

  <my-field label="volumePerTurn">
    <my-text :content="data.volumePerTurn" />
  </my-field>

  <my-field label="fuel">
    <my-text :content="data.fuel" />
  </my-field>

  <my-field label="smoke">
    <my-text :content="data.smoke" />
  </my-field>

  <my-field label="burn">
    <my-text :content="data.burn" />
  </my-field>
</template>

<script lang="ts">
export default {
  name: 'MaterialBurnFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { MaterialBurn } from 'src/type/loader/baseLoader/material/MaterialBurn';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: MaterialBurn;
}>();
const data = reactive(props.cddaData.data);
</script>
