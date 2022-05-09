<template>
  <my-render />
</template>

<script lang="ts">
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import MergerVNode from 'src/components/base/MegerVNode.vue';
import { h } from 'vue';
export default {
  name: 'LoaderView',
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup lang="ts">
const props = defineProps<{
  cddaData: SuperLoader<object>;
}>();
const myRender = h(MergerVNode, {}, () => props.cddaData.toView());
</script>
