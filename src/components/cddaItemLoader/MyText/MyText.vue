<template>
  <template
    v-for="(contentItem, index) in Array.isArray(props.content)
      ? props.content
      : [props.content]"
    :key="contentItem"
  >
    <my-text-part
      :content="contentItem"
      :route="(Array.isArray(props.route) ? props.route : [props.route])[index]"
      :p="props.p"
      :li="props.li"
    />

    <my-text-part
      v-if="
        props.separator &&
        index <
          (Array.isArray(props.content) ? props.content : [props.content])
            .length -
            1
      "
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
</script>
