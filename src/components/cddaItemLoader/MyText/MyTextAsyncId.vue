<template>
  <my-text
    :content="props.content?.getName()"
    :route="(props.content?.route as object)"
    :p="props.p"
    :li="props.li"
  />
</template>

<script lang="ts">
export default {
  name: 'MyTextAsyncId',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { AsyncId } from 'src/type/common/AsyncId';
const props = defineProps<{
  content?: AsyncId;
  p?: boolean;
  li?: boolean;
}>();
</script>
