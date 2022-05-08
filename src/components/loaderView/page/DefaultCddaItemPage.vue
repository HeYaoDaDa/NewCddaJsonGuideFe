<template>
  <json-card :jsonItem="props.cddaItem.jsonItem" />
</template>
<script lang="ts">
import JsonCard from 'src/components/loaderView/card/common/JsonCard.vue';
import { CddaItem } from 'src/type/common/CddaItem';
export default {
  name: 'DefaultCddaItemPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup lang="ts">
const props = defineProps<{
  cddaItem: CddaItem;
}>();
</script>
