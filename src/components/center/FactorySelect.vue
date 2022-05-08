<template>
  <loader-View />
</template>

<script lang="ts">
import { loaderFactorys } from 'src/constant/factoryConstant';
import { CddaItem } from 'src/type/common/CddaItem';
import { h } from 'vue';

export default {
  name: 'FactorySelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MegerVNode from 'src/components/base/MegerVNode.vue';
const props = defineProps<{
  cddaItem: CddaItem;
}>();
console.log(props.cddaItem);
const loader =
  props.cddaItem.data ??
  loaderFactorys
    .find((loaderFactory) => loaderFactory.validate(props.cddaItem))
    ?.getLoader();
loader?.load(props.cddaItem.jsonItem);
const loaderView = h(MegerVNode, null, () => loader?.toView());
</script>
