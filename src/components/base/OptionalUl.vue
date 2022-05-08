<template>
  <ul v-if="props.ul">
    <slot />
  </ul>

  <slot v-else />
</template>
<script lang="ts">
export default {
  name: 'OptionalUl',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  ul?: boolean;
}>();
</script>
