<template>
  <my-text
    :content="props.content ? toArray(props.content).map((item) => item.getName()) : undefined"
    :route="props.content ? toArray(props.content).map((item) => item.route) : undefined"
    :separator="props.separator"
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
import { toArray } from 'src/util/commonUtil';
const props = defineProps<{
  content?: Array<AsyncId>;
  separator?: string;
  p?: boolean;
  li?: boolean;
}>();
</script>
