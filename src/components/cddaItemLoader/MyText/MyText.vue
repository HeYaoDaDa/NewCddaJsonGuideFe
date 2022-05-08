<template>
  <template v-for="(contentItem, index) in contents" :key="contentItem">
    <my-text-part
      :content="contentItem"
      :route="routes[index]"
      :p="props.p"
      :li="props.li"
    />

    <my-text-part
      v-if="props.separator && index < contents.length - 1"
      :content="props.separator"
    />
  </template>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
import MyTextPart from './MyTextPart.vue';
export default {
  name: 'MyValue',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  content?: string | number | boolean | string[] | number[] | boolean[];
  // FIXME : this object is clear warn, I should is RouteLocationRaw
  route?: object | RouteLocationRaw[];
  separator?: string; // in content is array and span
  p?: boolean;
  li?: boolean;
}>();
const contents = Array.isArray(props.content) ? props.content : [props.content];
const routes = Array.isArray(props.route) ? props.route : [props.route];
</script>
