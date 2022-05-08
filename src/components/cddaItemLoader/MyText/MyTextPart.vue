<template>
  <li v-if="props.li">
    <optional-route
      :content="formatContent(props.content)"
      :route="props.route"
    />
  </li>

  <p v-if="props.p">
    <optional-route
      :content="formatContent(props.content)"
      :route="props.route"
    />
  </p>

  <span v-if="!(props.p || props.li)">
    <optional-route
      :content="formatContent(props.content)"
      :route="props.route"
    />
  </span>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { RouteLocationRaw } from 'vue-router';
import OptionalRoute from 'src/components/base/OptionalRoute.vue';
export default {
  name: 'MyTextPart',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  content?: string | number | boolean;
  route?: RouteLocationRaw;
  p?: boolean;
  li?: boolean;
}>();
function formatContent(content: string | number | boolean | undefined) {
  switch (typeof content) {
    case 'string':
      return content;
    case 'number':
      if (Number.isInteger(content)) {
        return Math.trunc(content);
      } else {
        return content.toFixed(2);
      }
    case 'boolean':
      const i18n = useI18n();
      return i18n.t('base.' + (content ? 'true' : 'false'));
    default:
      return content;
  }
}
</script>
